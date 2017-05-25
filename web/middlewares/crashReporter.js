/**
 * 在 state 被更新且 listener 被通知之後傳送當機回報。
 */

const crashReporter = store => next => action => {
	try {
		return next(action);
	} catch (err) {
		console.log('@crashReporter', err.stack);
		trackJs.track(err);
		// if(confirm('發生錯誤，按下確認重新讀取網頁。')) {
		// 	window.location.reload()
		// }
		return null;
	}
};

export default crashReporter;
