const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const adminRoute = require('./routes/admin-route');
const apiRoute = require('./routes/api-route');
const session = require('express-session');

//! config
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//! middleware
app.use(cors());
app.use(express.json());
app.use(logger('dev'));
app.use(
	session({
		secret: 'mySecretKey',
		saveUninitialized: true,
		resave: false,
	})
);

app.use((req, res, next) => {
	res.locals.message = req.session.message;
	delete req.session.message;
	next();
});

//! route
app.get('/', (req, res) => {
	res.render('index');
});

app.get('/cars', (req, res) => {
	res.render('cars');
});

app.use('/admin', adminRoute);
app.use('/api', apiRoute);

app.use((req, res) => {
	res.status(404).json({
		status: 'NOT FOUND',
		message: '404 - Page Not Found',
	});
});

module.exports = app;
