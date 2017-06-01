'use strict';

import 'babel-polyfill';
import 'script-loader!jquery';
import './styles/app.less';
import './styles/app.scss';

import React from 'react';
import store from './store.js';
import { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import { Layout, Main } from './views/index.js';
// import { Discounts, PrePaidCredits, Skus, SkusMutation } from 'views/admin/index.js';

const _history = createHistory();
global._history = _history;

class App extends Component {
	render () {
		return (
			<Router history={global._history}>
				<Layout>
					<Switch>
						<Route component={Main} />
					</Switch>
				</Layout>
			</Router>
		);
	}
}

render(
	(
		<Provider store={store}>
			<App />
		</Provider>
	),
	document.getElementById('root')
);
