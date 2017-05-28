
'use strict';

import qs from 'qs';
import _ from 'lodash';
import superagent from 'superagent';
import types from '../actions.js';

/*
	這隻的工作是作把 type=GQL 的 action 轉換成新的 action
	參數
		endpoint: 端點，預設值為 `/graphql`
		new_type: 新的 action type
		gql: 查詢，字串
		variables: 參數，物件
		mapping: 函數, 參數為 graphql server 回傳的資料 res.body.data, 回傳資料變成新的 action
		cache: 是否使用 server-side memcached，預設值為 `false`
		name: 查詢名稱，這是搭配 notification 使用的
	回傳
		Promise 物件
*/

const graphqlLayer = store => next => action => {

	if(action.type == 'GQL') {

		action = Object.assign({
			endpoint : '/graphql',
			cache : false,
		}, action);

		return new Promise((resolve,reject) => {

			const { endpoint, gql, cache, variables, files } = action;

			superagent.post('/graphql')
			.send({
				query : gql,
				variables : variables || { },
			})
			.set('Accept', 'application/json')
			.end((err, res = {}) => {

				const error = res.body && res.body.errors ? res.body.errors : err;
				if(error) {
					return reject(error);
				}

				let result = {
					...res.body.data,
					type : action.new_type || 'NOP',
				};
				if(action.mapping) {
					try {
						result = {
							...action.mapping(res.body.data),
							type : action.new_type || 'NOP',
						};
					} catch (err) {
						return reject(err);
					}
				}

				const tmp = {
					...result,
					type : action.new_type || 'NOP',
				};
				store.dispatch(tmp);

				return resolve(result);

			});

		});

	}

	return next(action);

};

export default graphqlLayer;

function decideEndpoint (endpoint, gql, cache) {
	const queryObject = {};
	if(cache) queryObject.cache = true;
	return `${endpoint}?${qs.stringify(queryObject)}`;
}

// TODO 檢查檔案大小，後台不能超過 20MB，前台不能超過 5MB
function generatePayload (gql, variables, files) {

	const formData = new FormData();
	formData.append('query', gql);
	if(variables instanceof Object) {
		formData.append('variables', JSON.stringify(variables));
	}

	if(files instanceof Object) {
		for(let key in files) {
			const value = files[key];
			if(value instanceof File) {
				formData.append(key, value);
			}
			else if(value instanceof FileList) {
				_.forEach(value, (ele, index) => {
					formData.append(key + '[]', ele);
				});
			}
			else if(
				value instanceof Array &&
				value.length > 0 &&
				value[0] instanceof File
			) {
				_.forEach(value, (ele, index) => {
					formData.append(key + '[]', ele);
				});
			}
		}
	}

	return formData;

}
