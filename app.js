"use strict";

const express = require('express');
const requestPromise = require('request-promise');
const app = express();

app.get('', (req, res) => {
	res.send('Hello Worlds');
});

app.get('/top', async (req, res, next) => {	
	try {
		const finalStories = [];		
		const topStories = await requestPromise({
			uri: 'https://hacker-news.firebaseio.com/v0/topstories.json',
			json: true
		});
		const initialLoad = topStories.slice(0, 10);

		await Promise.all(initialLoad.map(async story => {
			const item = requestPromise({
				uri: 'https://hacker-news.firebaseio.com/v0/item/'+story+'.json',
				json:true
			});
			return finalStories.push(await Promise.resolve(item));
		}))
		await res.send(finalStories);		
	} catch (error) {
		console.log(error);
	}
	
})

app.listen(3000, function () {
	console.log('Example app listening on port 3000');
});