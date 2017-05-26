
'use strict';

const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const LiveReloadPlugin = require('webpack-livereload-plugin');

const uglify_plugin = new webpack.optimize.UglifyJsPlugin({
	compress : {
		warnings : false,
		unsafe : false,
	},
	mangle : true,
	beautify : false,
	sourceMap: false,
});

const plugins = [
	new LiveReloadPlugin(),
	// uglify_plugin,
];

if(process.env.NODE_ENV == 'production') {
	plugins.push(new webpack.DefinePlugin({
		'process.env' : {
			'NODE_ENV' : JSON.stringify('production'),
		},
	}));
	plugins.push(uglify_plugin);
}

module.exports = {
	entry : {
		'app' : [
			'babel-polyfill',
			'./web/app.jsx',
		],
	},
	output : {
		path : path.resolve(__dirname, 'web/dist'),
		filename : "[name].js",
	},
	resolve : {
		extensions : ['', '.js', '.jsx'],
		alias : {
			components : path.join(__dirname, 'web/components'),
		},
	},
	module : {
		loaders : [
			{
				test : /\.js|jsx$/,
				loaders : ['babel?cacheDirectory'],
				exclude : [/node_modules/, /^backend/, /^tests/],
			},
			{
				test : /\.less$/,
				loader : 'style-loader!css-loader!postcss-loader!less-loader',
			},
			{
				test : /\.css$/,
				loader : 'style-loader!css-loader!postcss-loader',
			},
		],
		noParse : /node_modules\/quill\/dist/
	},
	plugins : plugins,
};
