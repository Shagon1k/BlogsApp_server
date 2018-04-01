process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
const Blog = require('../../models/Blog.js');

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../app.js');
let should = chai.should();

chai.use(chaiHttp);

describe('Blogs', () => {
	let dummyBlog1 = {
			author: 'ololo',
			title: 'title',
			message: 'message'
		};
	let dummyBlog2 = {
		author: 'ololo2',
		title: 'title2',
		message: 'message2'
	};
	beforeEach((done) => {
		Blog.remove({}, (err) => {
			done();
		});
	});

	describe('/GET blogs', () => {
		it('should get all blogs even if there is no blogs', (done) => {
			chai.request(app)
				.get('/blogs')
				.end((err, res) => {
					res.should.have.status(200);
					res.body["blogs"].should.be.a('array');
					res.body["blogs"].length.should.be.eql(0);
					done();
				})
		})
		it('should get all blogs', (done) => {
			let blog = new Blog(dummyBlog1);
			let blog2 = new Blog(dummyBlog2);
			blog.save(() => {
				blog2.save(() => {
				chai.request(app)
					.get('/blogs')
					.end((err, res) => {
						res.should.have.status(200);
						res.body["blogs"].should.be.a('array');
						res.body["blogs"].length.should.be.eql(2);
						done();
					})
				})
			})
		})
	})

	describe('/GET/:id blog', () => {
		it('should get particular blog', (done) => {
			let blog = new Blog(dummyBlog1);
			blog.save((err, blog) => {
				chai.request(app)
					.get('/blogs/' + blog.id)
					.end((err, res) => {
						res.should.have.status(200);
						res.body["blog"].should.be.a('object');
						res.body["blog"].should.have.property('title');
						res.body["blog"].should.have.property('author');
						res.body["blog"].should.have.property('message');
						res.body["type"].should.be.eql('blog_get');
						done();
					})
			})
		})
		it('should throw error if no blog', (done) => {
			chai.request(app)
				.get('/blogs/' + 123)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.not.have.property('blog');
					done();
				})
		})
	})

	describe('/PUT blog', () => {
		it('should put blog if all is ok', (done) => {
			let blog = {
				author: 'ololo',
				title: 'title',
				message: 'message'
			}

			chai.request(app)
				.put('/blogs')
				.send(blog)
				.end((err, res) => {
					res.should.have.status(200);
					res.body["blog"].should.be.a('object');
					res.body["type"].should.be.eql('blog_add');
					done();
				})
		});

		it('should not put blog without title', (done) => {
			let blog = {
				author: 'ololo',
				message: 'message'
			}

			chai.request(app)
				.put('/blogs')
				.send(blog)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					done();
				})
		})
	})

	describe('/DELETE blog', () => {
		it('should delete blog', (done) => {
			let blog = new Blog(dummyBlog1);
			blog.save((err, blog) => {
				chai.request(app)
					.delete('/blogs/' + blog.id)
					.end((err, res) => {
						res.should.have.status(200);
						res.body["type"].should.be.eql('blog_delete');
						done();
					})
			})
		})
	})
})