let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

const Blog = require('../models/Blog');

//All blogs page
function getBlogs(req, res) {	//'ensureAuthenticated' in future
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
}
router.get('/', ensureAuthenticated, getBlogs);

//Particular blog page
function getBlog(req, res, next) {
	const id = req.params.id;

	Blog.findById(id, (error, blog) => {
		if (!error) {
			res.send({
				type: 'blog_get',
				success: true,
				blog: blog
			})
		} else {
			res.send(error);
		}
	});
}
router.get('/:id', ensureAuthenticated, getBlog);

//Add new blog
function addBlog(req, res, next) {
	const blog = new Blog({
		title: req.body.title,
		author: req.body.author,
		date: (new Date().toISOString()),
		message: req.body.message
	});

	blog.save((err, blog) => {
		if(err) {
			res.send(err);
		} else {
			res.send({
				type: 'blog_add',
				success: true,
				blog,
				message: 'Blog has been added!'
			});
		}
	});
}
router.put('/', ensureAuthenticated, addBlog);

//Update existing blog's message
function updateBlog(req, res, next) {
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
}
router.post('/update', ensureAuthenticated, updateBlog);

//Delete existing blog
function deleteBlog(req, res, next) {
	const id = req.params.id;

	Blog.findById(id).remove(() => {
		res.send({
			type: 'blog_delete',
			success: true,
			message: 'Blog has beeen deleted!'
		});
	});
}
router.delete('/:id', ensureAuthenticated, deleteBlog);

//Ensure whether user is logged in before response
function ensureAuthenticated(req, res, next){
	console.log('authentication started');
	if (process.env.NODE_ENV === 'test') {
		return next();
	}
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.send({
			type: 'authentication',
			success: false,
			message: 'You are not authenticated'
		});
	}
}

module.exports = router;