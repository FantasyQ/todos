'use strict';

process.env.DISABLE_MORGAN = 'TRUE';
process.env.PORT = process.env.PORT || 5000;
global._session_key = Date.now();

// 載入測試工具
const chai = require('chai');
global.chai = chai;
global.expect = chai.expect;

require('../api/index.js');

before(done => {
	console.log('wait for 2 secs');
	setTimeout(done, 2000);
});
