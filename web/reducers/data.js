
const types = require('../actions.js');

const DEFAULT_STATE = {};

export default function DataReducer (state = DEFAULT_STATE, action) {

	switch(action.type) {

	case types.SET_DATA : {
		return {
			...state,
			...action,
		};
	}

	case types.CLEAR_DATA : {
		return { };
	}

	default: return state;

	}

}
