'use strict';

import React from 'react';
import { If } from 'components';
import { Component } from 'react';
import { connect } from 'react-redux';

class Main extends Component {

	render () {
		const { todos } = this.props;
		return (
			<div className='Main'>
				<h1>todos</h1>
				<div className='Form'>
					<input className="NewTODO" placeholder="What needs to be done?" value="" />
				</div>
				<If test={todos instanceof Array && todos.length > 0}>
					<div className='TODOs'>
						<input className="ToggleAll" type="checkbox" />
					</div>
				</If>
			</div>
		);
	}

	componentWillMount () {
		this.props.dispatch({
			type : 'CLEAR_DATA',
		});
	}

}

export default connect(state => {
	return {
		todos : null,
		...state.data,
	};
})(Main)
