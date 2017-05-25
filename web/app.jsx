'use strict';

import 'babel-polyfill';
import 'script-loader!jquery';
import './styles/app.less';
import './styles/app.sass';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store.js';
// import { Base } from '../components/';
import { Router, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
// import { Layout, Home, Buylogs, BuylogsAdd, BuylogsSpecialAdd } from 'views/admin/index.js';
// import { Discounts, PrePaidCredits, Skus, SkusMutation } from 'views/admin/index.js';

const _history = createHistory();
global._history = _history;

class App extends Base {
	renderx () {
		return (
			<Router history={global._history}>
				<Layout>
					<Route path="/" exact component={Home} />
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
