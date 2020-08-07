require('dotenv').config();

const http = require('http');

const express = require('express');
const app = express();
var path = require('path');

const csv = require('csv-parser');
const fs = require('fs');

const list = [];
var name;

fs.createReadStream('./data/worldcities_weather.csv')
	.pipe(csv())
	.on('data', (row) => {
		name = row.city_ascii+', '+ row.country;
		list.push(name);
	})
	.on('end', () => {
		console.log('csv file success');
	})

const api_key = process.env.API_KEY;

const PORT = process.env.PORT;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	
	res.render('weather', {api_key: api_key, list: list});
	
});

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
