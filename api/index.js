'use strict';

const morgan = require('morgan');
const moment = require('moment');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const cookieSession = require('cookie-session');
const { GraphQLEnumType, GraphQLID } = require('graphql');
const { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } = require('graphql');

/////////////////////////////////////////////////////////

const app = express();
app.set('trust proxy', true);
app.use(morgan('combined'));
app.use(cookieSession({
	name : 'session',
	keys : ['TEST0123456789'],
	maxAge : 24 * 60 * 60 * 1000 * 365,
}));

/////////////////////////////////////////////////////////

const EnumTODOStatus = new GraphQLEnumType({
	name : 'TODOStatus',
	values : {
		CMPL : { value : 'CMPL', description : 'complete' },
		ACTIVE : { value : 'ACTIVE', description : 'active' },
	},
});

const TypeTODO = new GraphQLObjectType({
	name : 'TODO',
	fields : {
		id : { type : GraphQLID },
		message : { type : GraphQLString },
		status : { type : EnumTODOStatus },
	},
});

const schema = new GraphQLSchema({
	query : new GraphQLObjectType({
		name : 'Query',
		fields : {
			todos : {
				type : new GraphQLList(TypeTODO),
				description : 'todos',
				resolve : (parent,args,req) => {
					return req.session.todos || [];
				},
			},
		},
	}),
	mutation : new GraphQLObjectType({
		name : 'Mutation',
		fields : {
			add_todo : {
				type : TypeTODO,
				args : {
					message : { type : new GraphQLNonNull(GraphQLString) },
				},
				resolve : (parent,args,req) => {
					const new_todo = {
						id : Date.now(),
						message : args.message,
						status : 'ACTIVE',
					};
					req.session.todos = (req.session.todos || []).concat(new_todo);
					return new_todo;
				},
			},
			update_todo : {
				type : TypeTODO,
				args : {
					id : { type : new GraphQLNonNull(GraphQLID) },
					message : { type : GraphQLString },
					status : { type : EnumTODOStatus },
				},
				resolve : (parent,args,req) => {
					let target;
					req.session.todos = req.session.todos.map(t => {
						if(t.id == args.id) {
							target = t;
							if(args.message) {
								t.message = args.message;
							}
							if(args.status) {
								t.status = args.status;
							}
						}
						return t;
					});
					return target;
				},
			},
			remove_todo : {
				type : TypeTODO,
				args : {
					id : { type : new GraphQLNonNull(GraphQLID) },
					message : { type : GraphQLString },
					status : { type : EnumTODOStatus },
				},
				resolve : (parent,args,req) => {
					let target;
					req.session.todos = req.session.todos.filter(t => {
						if(t.id == args.id) {
							target = t;
						}
						return t.id != args.id;
					});
					return target;
				},
			},
		},
	}),
});

//////////////////////////////////////////////////////////

let JS_VERSION = moment().format('YYYYMMDDHH');
require('fs').readFile(__dirname + '/../web/dist/app.js', 'utf8', (err, data) => {
	if(data) JS_VERSION = md5(data);
});

function md5 (str) {
	return require('crypto').createHash('md5').update(str, 'utf8').digest('hex');
}

app.get('*', (req, res, next) => {
	require('fs').readFile(__dirname + '/../web/dist/app.ejs', (err, result) => {
		if(err) return next(err);
		result = result.toString();
		result = require('ejs').render(result, {
			jsver : JS_VERSION,
		});
		res.status(200);
		res.set({
			'Content-Type' : 'text/html; charset=UTF-8',
		});
		return res.send(result);
	});
});

//////////////////////////////////////////////////////////

app.use('/graphql', graphqlHTTP({
	schema : schema,
	graphiql : true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
