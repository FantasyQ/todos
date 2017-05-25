
import reducer from './reducers/index.js';
import { createStore, applyMiddleware } from 'redux';
import { logger, crashReporter, vanillaPromise, graphqlLayer, ajaxLayer } from './middlewares/index.js';

const store = createStore(reducer, applyMiddleware(
	ajaxLayer,
	graphqlLayer,
	vanillaPromise,
	logger,
	crashReporter
));
global._store = store;
// console.debug('defrault state:', store.getState());
// console.debug('store:', store);

export default store;
