let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

const Blog = require('../models/Blog');

//All blogs page
router.get('/', ensureAuthenticated, (req, res) => {	//'ensureAuthenticated' in future
	Blog.find({}, (error, blogs) => {
		if(!blogs) next(new Error('No blogs found :('));
		if (!error) {
			res.send({
				type: 'blogs_get',
				success: true,
				blogs: blogs
			})
		} else {
			next(error);
		}
	});
});

//Particular blog page
router.get('/:id', ensureAuthenticated, (req, res, next) => {
	const id = req.params.id;

	Blog.findById(id, (error, blog) => {
		if (!error) {
			res.send({
				type: 'blog_get',
				success: true,
				blog: blog
			})
		} else {
			next(error);
		}
	});
});

//Add new blog
router.put('/', ensureAuthenticated, (req, res, next) => {
	const blog = new Blog({
		title: req.body.title,
		author: req.body.author,
		date: (new Date().toISOString()),
		message: req.body.message
	});

	blog.save().then((blog) => {
		res.send({
			type: 'blog_add',
			success: true,
			blog,
			message: 'Blog has been added!'
		});
	});
});

//Update existing blog's message
router.post('/update', ensureAuthenticated, (req, res, next) => {
	const id = req.body.id;
	const changedBlog = {
		title: req.body.title,
		author: req.body.author,
		date: (new Date().toISOString()),
		message: req.body.message
	};

	Blog.findByIdAndUpdate(id, changedBlog, (error, blog) => {
		if (!error) {
			const retBlog = changedBlog;
			retBlog._id = id;
			res.send({
				type: 'blog_update',
				success: true,
				blog: retBlog,
				message: 'Blog has beeen updated!'
			});
		} else {
			next(error);
		}
	});
});

//Delete existing blog
router.delete('/:id', ensureAuthenticated, (req, res, next) => {
	const id = req.params.id;

	Blog.findById(id).remove(() => {
		res.send({
			type: 'blog_delete',
			success: true,
			message: 'Blog has beeen deleted!'
		});
	});
});

//Ensure whether user is logged in before response
function ensureAuthenticated(req, res, next){
	console.log('authentication started');
	/*if (req.isAuthenticated()) {
		return next();
	} else {
		res.send({
			type: 'authentication',
			success: false,
			message: 'You are not authenticated'
		});
	}*/
	return next();
}

module.exports = router;