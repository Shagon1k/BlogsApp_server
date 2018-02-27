let mongoose = require('mongoose');

let BlogSchema = mongoose.Schema({
	title: {
		type: String,
		unique: true,
		required: [true, 'Need blog title']
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