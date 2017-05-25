
const vanillaPromise = store => next => action => {
	if(
		action instanceof Promise &&
		action.then instanceof Function
	) {
		return Promise.resolve(action).then(result => {
			console.log('dispatch in vanillaPromise', result);
			store.dispatch(result);
		});
	} else {
		return next(action);
	}
};

export default vanillaPromise;
