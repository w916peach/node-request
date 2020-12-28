const http = require('http');
const https = require('https')
const qs = require('querystring');
const urlmodel = require('url');
/**
 * @param {String} url 
 * @param {Object<method headers params body>} options
 * @return {Promise<data>} 
 */
module.exports = (url, { method = 'GET', headers = {}, params = {}, body = {} }) => {
	let querystr = qs.stringify(params);
	url = querystr ? url + '?' + querystr : url;
	bodystr = JSON.stringify(body);
	return new Promise((reslove) => {
		const request = urlmodel.parse(url).protocol === 'https:' ? https.request : http.request;
		const req = request(url, { method, headers }, res => {
			let buf = Buffer.alloc(0);
			res.on('data', chunk => {
				buf = Buffer.concat([buf, chunk]);
			});
			res.on('end', () => {
				reslove(buf);
			});
		})
		req.write(bodystr);
		req.end();
	});
}
