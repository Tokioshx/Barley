const { request } = require('undici');
const express = require('express');
const { clientId, clientSecret, port } = require('../handler/config.json');
const app = express();

app.get('/', async ({ query }, response) => {
	const { code } = query;

	if (code) {
		try {
			const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
				method: 'POST',
				body: new URLSearchParams({
					client_id: clientId,
					client_secret: clientSecret,
					code,
					grant_type: 'authorization_code',
					redirect_uri: `http://localhost:${port}`,
					scope: 'identify',
				}).toString(),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});

			const oauthData = await tokenResponseData.body.json();

			const userResult = await request('https://discord.com/api/users/@me', {
				headers: {
					authorization: `${oauthData.token_type} ${oauthData.access_token}`,
				},
			});

			console.log(await userResult.body.json());
		} catch (error) {
			console.error(error);
		}
	}

	return response.sendFile('./website/index.html', { root: '.' });
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));