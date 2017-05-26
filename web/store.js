
import reducer from './reducers/index.js';
import { createStore, applyMiddleware } from 'redux';
import { logger, crashReporter, vanillaPromise, graphqlLayer } from './middlewares/index.js';

const store = createStore(reducer, applyMiddleware(
	graphqlLayer,
	vanillaPromise,
	logger,
	crashReporter
));
global._store = store;
// console.debug('defrault state:', store.getState());
// console.debug('store:', store);

export default store;
