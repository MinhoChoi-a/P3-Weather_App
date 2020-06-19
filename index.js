require('dotenv').config();

const express = require('express');
const app = express();
var path = require('path');

const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	
	res.render('weather');
	
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
