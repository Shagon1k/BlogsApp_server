let User = require('../../models/User.js');
let expect = require('chai').expect;

describe('User scheme', function() {
	it('should be invalid if no username', function(done) {
		let dummyUser = new User({
			password: 'passw',
			email: 'user@gmail.com'
		});
		dummyUser.validate(function(err) {
			expect(err.errors.username).to.exist;
			done();
		})
	});

	it('should be invalid if no password', function(done) {
		let dummyUser = new User({
			username: 'user',
			email: 'user@gmail.com'
		});
		dummyUser.validate(function(err) {
			expect(err.errors.password).to.exist;
			done();
		})
	});

	it('should save even without email', function(done) {
		let dummyUser = new User({
			username: 'user',
			password: 'passw',
		});
		dummyUser.validate(function(err) {
			expect(err).to.not.exist;
			done();
		})
	});
})