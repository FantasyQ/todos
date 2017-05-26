'use strict';

import React from 'react';
import cx from 'classnames';
import { If } from 'components';
import { Component } from 'react';
import { connect } from 'react-redux';

class Main extends Component {

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
							{(todos || []).map((todo,index) => {
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
							<li className={cx({active : !filter})} onClick={this.onChange.bind(this, 'filter', null)}>
								All
							</li>
							<li className={cx({active : filter == 'ACTIVE'})} onClick={this.onChange.bind(this, 'filter', 'ACTIVE')}>
								Active
							</li>
							<li className={cx({active : filter == 'CMPL'})} onClick={this.onChange.bind(this, 'filter', 'CMPL')}>
								Completed
							</li>
						</ul>
					</div>
				</If>
			</div>
		);
	}

	onKeyPress (e) {
		if (e.key === 'Enter') {
			this.props.dispatch({
				type : 'SET_DATA',
				todos : [].concat(this.props.todos || []).concat({
					id : Date.now(),
					message : this.props.new_todo_value,
					status : 'ACTIVE',
				}),
				new_todo_value : '',
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

	}

	onChangeTODO (id, name, value) {
		const todos = [].concat(this.props.todos).map(todo => {
			const new_todo = { ...todo };
			if(todo.id + '' == id + '') {
				new_todo[name] = value;
			}
			return new_todo;
		});
		return this.onChange('todos', todos);
	}

	componentWillMount () {
		this.props.dispatch({
			type : 'CLEAR_DATA',
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
						onChange={e => onChange(data.id, 'status', data.status == 'CMPL' ? 'ACTIVE' : 'CMPL')}
					/>
					<label>{data.message}</label>
					<button onClick={onDelete}></button>
				</div>
				<input className="edit" value={data.message} />
			</li>
		);
	}
}

export default connect(state => {
	return {
		todos : [
			{
				id : 1,
				message : 'test todo message 1',
				status : 'ACTIVE'
			},
			{
				id : 2,
				message : 'test todo message 2',
				status : 'CMPL',
			}
		],
		new_todo_value : '',
		...state.data,
	};
})(Main)
