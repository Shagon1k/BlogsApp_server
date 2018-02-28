let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

//Passport strategy
passport.use(new LocalStrategy((username, password, done) => {
	User.getUserByUsername(username, (error, user) => {
		if (error) {
			throw error;
		}
		if (!user) {
			return done(null, false, {message: 'Unknown User'});
		}

		User.checkPassword(password, user.password, (error, isMatch) => {
			if (error) {
				throw error;
			}
			if (isMatch) {
				return done(null, user);
			} else {
				return done(null, false, {message: 'Invalid password'});
			}
		});
	});
}));

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.getUserById(id, (error, user) => {
		done(error, user);
	})
});

//Register new user
router.post('/register', (req, res, next) => {
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;
	const password2 = req.body.password2;

	if (!username || !password) {
		next(new Error('All required fields havent been filled'));
	}
	if (password !== password2) {
		next(new Error('Passwords dont match'));
	}

	User.getUserByUsername(username, (error, user) => {
		if (user) {
			next(new Error('User already exists'));
		} else {
			let newUser = new User({
				username: username,
				password: password,
				email: email
			});

			User.createUser(newUser, (error, user) => {
				if (error) {
					next(error);
				}
				else {
					console.log(`New user ${username} has been created!`);
				}
			})
			
			res.send({
				type: 'registration',
				success: true,
				message: 'User registered succesfully'
			});
		}
	});
});

//Login existing user
router.post('/login', passport.authenticate('local'), function(req, res) {
	let username = req.body.username;
	User.getUserByUsername(username, (error, user) => {
		if (error) {
			throw error;
		}
		res.send({
			type: 'log_in',
			success: true,
			user: {
				username: user.username,
				email: user.email
			},
			message: 'User logged in'
		})
	})
});

router.post('/logout', (req, res, next) => {
	
	req.logout();
	req.session.destroy((err) => {
		if (err) {
			next(err);
		}
		return res.send({
			type: 'log_out',
			success: true,
			message: 'User logged out'
		});
	});
})


module.exports = router;