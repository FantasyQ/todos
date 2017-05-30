'use strict';

const Nightmare = require('nightmare');

describe('測試新增 todo', () => {

	it('Layout 和 Main 有輸出', done => {
		const nightmare = Nightmare({
			show : true,
			webPreferences : { partition : `persist:${global._session_key}` },
		});
		nightmare.goto(`http://localhost:${process.env.PORT}/`)
		.wait('div.Layout div.Main')
		.end()
		.then(result => {
			return done();
		})
		.catch(err => {
			return done(err);
		});
	});

	const msg1 = `測試 TODO ${Date.now()}`;

	it('新增 TODO', done => {
		const nightmare = Nightmare({
			show : true,
			webPreferences : { partition : `persist:${global._session_key}` },
		});
		nightmare.goto(`http://localhost:${process.env.PORT}/`)
		.type('div.Main div.Form input.NewTODO', msg1)
		.type('div.Main div.Form input.NewTODO', '\u000d')
		.wait(250)
		.evaluate(() => {
			return document.querySelector('ul.TODOList li.TODOItem label').innerText;
		})
		.end()
		.then(result => {
			expect(result).equal(msg1);
			return done();
		})
		.catch(err => {
			return done(err);
		});
	});

	it('標記 TODO 為完成', done => {
		const nightmare = Nightmare({
			show : true,
			webPreferences : { partition : `persist:${global._session_key}` },
		});
		nightmare.goto(`http://localhost:${process.env.PORT}/`)
		.click('ul.TODOList li.TODOItem input[type="checkbox"]')
		.wait('ul.TODOList li.TODOItem.complete')
		.end()
		.then(result => {
			return done();
		})
		.catch(err => {
			return done(err);
		});
	});

	it('測試篩選器 active', done => {
		const nightmare = Nightmare({
			show : true,
			webPreferences : { partition : `persist:${global._session_key}` },
		});
		nightmare.goto(`http://localhost:${process.env.PORT}/`)
		.click('ul.Filters li.for_active')
		.wait(250)
		.evaluate(() => {
			return document.querySelector('ul.TODOList li.TODOItem') === null;
			// expect(document.querySelector('ul.TODOList li.TODOItem')).equal(null);
		})
		.end()
		.then(result => {
			expect(result).equal(true);
			return done();
		})
		.catch(err => {
			return done(err);
		});
	});

});
