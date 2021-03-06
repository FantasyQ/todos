'use strict';

import superagent from 'superagent';

/*
	這隻的工作是作把 type=GQL 的 action 轉換成新的 action
	參數
		new_type: 新的 action type
		gql: 查詢，字串
		variables: 參數，物件
		mapping: 函數, 參數為 graphql server 回傳的資料 res.body.data, 回傳資料變成新的 action
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

			const { gql, variables } = action;

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
