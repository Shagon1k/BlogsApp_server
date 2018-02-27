let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let cors = require('cors');
let util = require('util');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/blogsapp_db');

//Application initizlize
let app = express();
let router = express.Router();

//Logger initialize
let logger = require('./logger.js');
app.use((req, res, next) => {
	logger.info(`Url: ${req.url}, method: ${req.method}`);
	next();
});

//Views Engine
//---No views engine---

//Static folder settings
//---No public folder---

//CORS Middleware
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(cors())

//Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

//Express Session
app.use(session({
    secret: 'top-secret',
    saveUninitialized: true,
    resave: true
}));

//Passport initizlise
app.use(passport.initialize());
app.use(passport.session());

//Global Vars
app.use((req, res, next) => {
	res.locals.user = req.user || null;
	next();
});

//Index page render
app.get('/', (req, res, next) => {
	res.send({
		success: true,
		message: 'Welcome to Blogs application'
	});
});

app.use('/blogs', require('./routes/blogs'));
app.use('/users', require('./routes/users'))

//Time page
app.get('/time', (req, res) => {
	res.send((new Date()).toLocaleTimeString());
});

//Default page render if no matches
app.use((req, res, next) => {
	res.send({
		success: false,
		message: 'No such page! :('
	});
	next();
});

//Error handling middleware
app.use((error, req, res, next) => {
	console.error(error);
	res.status(error.status || 500);
	res.send({
		success: false,
		message: 'Error!' + error.message
	});
});

//Start listen to application
app.listen(1337, () => {
 	console.log('Blogs app listening on port 1337!');
});