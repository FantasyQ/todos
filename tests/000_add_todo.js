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

	const msg1 = `測試 TODO ${parseInt(Date.now() / 1000000)}`;

	it('新增', done => {
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

	it('標記為完成', done => {
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

	it('篩選器 Active', done => {
		const nightmare = Nightmare({
			show : true,
			webPreferences : { partition : `persist:${global._session_key}` },
		});
		nightmare.goto(`http://localhost:${process.env.PORT}/`)
		.click('ul.Filters li.for_active')
		.wait(250)
		.evaluate(() => {
			return document.querySelector('ul.TODOList li.TODOItem') === null;
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

	it('篩選器 Completed', done => {
		const nightmare = Nightmare({
			show : true,
			webPreferences : { partition : `persist:${global._session_key}` },
		});
		nightmare.goto(`http://localhost:${process.env.PORT}/`)
		.click('ul.Filters li.for_cmpleted')
		.wait(250)
		.evaluate(() => {
			return document.querySelector('ul.TODOList li.TODOItem') != null;
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

	it('修改訊息', done => {
		const nightmare = Nightmare({
			show : true,
			webPreferences : { partition : `persist:${global._session_key}` },
		});
		nightmare.goto(`http://localhost:${process.env.PORT}/`)
		.click('ul.TODOList li.TODOItem label')
		.wait('ul.TODOList li.TODOItem input.edit')
		.type('ul.TODOList li.TODOItem input.edit', ' 測試更新')
		.wait(100)
		.evaluate(() => {
			return document.querySelector('ul.TODOList li.TODOItem label').innerText;
		})
		.end()
		.then(result => {
			expect(result).equal(msg1 + ' 測試更新');
			return done();
		})
		.catch(err => {
			return done(err);
		});
	});

	it('測試刪除', done => {
		const nightmare = Nightmare({
			show : true,
			webPreferences : { partition : `persist:${global._session_key}` },
		});
		nightmare.goto(`http://localhost:${process.env.PORT}/`)
		.click('ul.TODOList li.TODOItem button')
		.wait(250)
		.evaluate(() => {
			return document.querySelector('ul.TODOList li.TODOItem') === null;
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
