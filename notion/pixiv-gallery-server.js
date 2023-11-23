const express = require('express');
const cors = require('cors');
const axios = require('axios');

const headers = {
	'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/103.0',
	Cookie: `PHPSESSID=${process.env.PIXIV_TOKEN};`
};

const app = express();
app.use(cors());

app.use((req, res, next) => {
	if (req.query?.authKey === process.env.AUTH_KEY) next();
	else {
		const error = new Error('Not Authorized.');
		error.status = 401;
		next(error);
	}
});

app.get('/', (req, res) => res.json({ success: true }));
app.get('/following', async (req, res) => {
	const { r18, page } = req.query;
	const modifiedPage = Math.min(9, Math.max(0, page));

	const { data: { body: { thumbnails: { illust: illusts } } } } = await axios(
		{
			url: 'https://www.pixiv.net/ajax/follow_latest/illust?p=1&mode=all&lang=en',
			method: 'get',
			headers
		}
	);

	res.json(
		illusts
			.filter(({ xRestrict }) => (r18 ? true : xRestrict === 0))
			.filter(({ width, height }) => (height * 0.8) - width > 0)
			.slice(modifiedPage * 6, modifiedPage * 6 + 6)
			.map(({ url }) => url
				.replace(/c\/250x250_80_a2\//, '')
				.replace('_square1200', '_master1200')
				.replace('_custom1200', '_master1200')
				.replace('custom-thumb', 'img-master'))
	);
});

app.get('/imgproxy', async (req, res) => {
	const { url } = req.query;

	try {
		const { data: stream } = await axios({
			url: decodeURIComponent(url),
			method: 'get',
			responseType: 'stream',
			headers: {
				Referer: 'https://www.pixiv.net'
			}
		});

		res.writeHead(200);
		stream.pipe(res);
	} catch (err) {
		console.log(err);
	}
});

app.listen(80);
