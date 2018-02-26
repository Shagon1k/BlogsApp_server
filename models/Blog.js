let mongoose = require('mongoose');

let BlogSchema = mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: [true, 'Need blog name']
	},
	author: {
		type: String,
		unique: true,
		required: [true, 'Need blog author']
	},
	date: {
		type: String
	},
	message: {
		type: String
	}
});

let Blog = module.exports = mongoose.model('Blog', BlogSchema);