let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');


let UserSchema = mongoose.Schema({
	username: {
		type: String,
		unique: true,
		index: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String
	}
});

let User = module.exports = mongoose.model('User', UserSchema);

//Create new user function
module.exports.createUser = (newUser, cb) => {
	bcrypt.genSalt(10, (error, salt) => {
	    bcrypt.hash(newUser.password, salt, (error, hash) => {
	    	console.log(newUser.password);
	    	console.log(hash);
	    	newUser.password = hash;
	    	newUser.save(cb);
	    });
	});
}

//Check whether particular user exists
module.exports.getUserByUsername = (username, cb) => {
	User.findOne({username: username}, cb);
}

//Get user by his id
module.exports.getUserById = (id, cb) => {
	User.findById(id, cb);
}

//Check password
module.exports.checkPassword = (password, hash, cb) => {
	bcrypt.compare(password, hash, (error, isMatch) => {
    	if (error) {
    		throw error;
    	}
    	cb(null, isMatch);
	});
}