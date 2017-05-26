'use strict';

import React from 'react';
import { Component } from 'react';

export default class Layout extends Component {

	render () {
		return <div className='Layout'>{this.props.children}</div>;
	}

}
