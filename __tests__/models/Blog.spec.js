let Blog = require('../../models/Blog.js');
let expect = require('chai').expect;

describe('Blog scheme', function() {
	it('should be invalid if no author', function(done) {
		let dummyBlog = new Blog({
			title: 'title',
			date: (new Date().toISOString()),
			message: 'message'
		});
		dummyBlog.validate(function(err) {
			expect(err.errors.author).to.exist;
			done();
		})
	});
	it('should be invalid if no title', function(done) {
		let dummyBlog = new Blog({
			author: 'author',
			date: (new Date().toISOString()),
			message: 'message'
		});
		dummyBlog.validate(function(err) {
			expect(err.errors.title).to.exist;
			done();
		})
	})
})