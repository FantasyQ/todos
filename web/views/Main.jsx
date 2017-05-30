'use strict';

import React from 'react';
import cx from 'classnames';
import { If } from 'components';
import { Component } from 'react';
import { connect } from 'react-redux';

class Main extends Component {

	componentWillMount () {
		this.props.dispatch({
			type : 'CLEAR_DATA',
		});
	}

	componentDidMount () {
		this._fetch();
	}

	render () {
		const { todos, filter, new_todo_value } = this.props;
		const allChecked = todos && todos.every(t => t.status == 'CMPL');
		return (
			<div className='Main'>
				<h1>todos</h1>
				<div className='Form'>
					<input className="NewTODO" placeholder="What needs to be done?"
						value={new_todo_value}
						onKeyPress={this.onKeyPress.bind(this)}
						onChange={e => this.onChange('new_todo_value', e.target.value, e)}
					/>
				</div>
				<If test={todos instanceof Array && todos.length > 0}>
					<div className='TODOs'>
						<input className="ToggleAll" type="checkbox" checked={allChecked}
							onChange={this.toggleAll.bind(this, allChecked ? 'ACTIVE' : 'CMPL')} />
						<ul className="TODOList" >
							{todos.map((todo,index) => {
								return (
									<TODOItem key={`${todo.id}-${index}`}
										data={todo} filter={filter}
										onChange={this.onChangeTODO.bind(this)}
										onDelete={this.onDelete.bind(this, todo.id)}
									/>
								);
							})}
						</ul>
					</div>
				</If>
				<If test={todos instanceof Array && todos.length > 0}>
					<div className='Footer'>
						<span className='TODOCount'>
							{todos ? todos.length : 0} items left
						</span>
						<ul className="Filters">
							<li className={cx({ active : !filter })} onClick={this.onChange.bind(this, 'filter', null)}>
								All
							</li>
							<li className={cx({ active : filter == 'ACTIVE' })} onClick={this.onChange.bind(this, 'filter', 'ACTIVE')}>
								Active
							</li>
							<li className={cx({ active : filter == 'CMPL' })} onClick={this.onChange.bind(this, 'filter', 'CMPL')}>
								Completed
							</li>
						</ul>
					</div>
				</If>
			</div>
		);
	}

	onKeyPress (e) {
		const { dispatch, todos, new_todo_value } = this.props;
		if (e.key === 'Enter') {
			return dispatch({
				type : 'GQL',
				gql : `
					mutation ($message:String!) {
						add_todo (message:$message) {
							id message status
						}
					}
				`,
				new_type : 'SET_DATA',
				variables : { message : new_todo_value },
				mapping : (data) => {
					const new_todos = [].concat(todos).concat(data.add_todo);
					return { todos : new_todos };
				},
			});
		}
	}

	onChange (name, value, e) {
		const action = { type : 'SET_DATA' };
		action[name] = value;
		this.props.dispatch(action);
	}

	toggleAll (value) {
		const todos = [].concat(this.props.todos).map(todo => {
			const new_todo = { ...todo };
			new_todo.status = value;
			return new_todo;
		});
		return this.onChange('todos', todos);
	}

	onDelete (id) {
		return this.props.dispatch({
			type : 'GQL',
			gql : `mutation ($id:ID!) { remove_todo (id:$id) { id } }`,
			variables : { id },
			new_type : 'NOP',
		})
		.then(result => {
			return this._fetch();
		});
	}

	onChangeTODO (id, name, value) {
		// local update
		const todos = [].concat(this.props.todos).map(todo => {
			const new_todo = { ...todo };
			if(todo.id + '' == id + '') {
				new_todo[name] = value;
			}
			return new_todo;
		});
		this.onChange('todos', todos);
		// remote update
		const variables = { id };
		variables[name] = value;
		return this.props.dispatch({
			type : 'GQL',
			gql : `
				mutation ($id:ID!,$message:String,$status:TODOStatus) {
					update_todo (id:$id message:$message status:$status) { id }
				}
			`,
			variables : variables,
			new_type : 'NOP',
		});
	}

	_fetch () {
		return this.props.dispatch({
			type : 'GQL',
			gql : `{ todos { id message status } }`,
			new_type : 'SET_DATA',
			mapping : (data) => {
				return { todos : data.todos };
			},
		});
	}

}

class TODOItem extends Component {
	render () {
		const { data, filter, onDelete, onChange } = this.props;
		if(filter && filter != data.status) return null;
		const classnames = cx({
			TODOItem : true,
			active : data.status == 'ACTIVE',
			complete : data.status == 'CMPL',
		});
		return (
			<li className={classnames}>
				<div>
					<input type="checkbox" checked={data.status == 'CMPL'}
						onChange={
							e => onChange(data.id, 'status', data.status == 'CMPL' ? 'ACTIVE' : 'CMPL')
						}
					/>
					<label>{data.message}</label>
					<button onClick={onDelete}></button>
				</div>
				<input className="edit" value={data.message}
					onChange={e => onChange(data.id, 'message', e.target.value)} />
			</li>
		);
	}
}

export default connect(state => {
	return {
		new_todo_value : state.data.new_todo_value || '',
		todos : state.data.todos || [],
		filter : state.data.filter,
	};
})(Main)
