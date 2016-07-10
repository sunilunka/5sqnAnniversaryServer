var expect = require('chai').expect;

var supertest = require('supertest');
var app = require('../../../server/app');

describe('App Routing', function () {

	// beforeEach('Establish DB connection', function (done) {
	// 	if (mongoose.connection.db) return done();
	// 	mongoose.connect(dbURI, done);
	// });
  //
	// afterEach('Clear test database', function (done) {
	// 	clearDB(done);
	// });

	describe('Should return 404 on requesting invalid paths and assets', function () {

		var guestAgent;

		beforeEach('Create guest agent', function () {
			guestAgent = supertest.agent(app);
		});

		it('should return a 404 response when trying to access assets', function (done) {
			guestAgent.get('/stuff.html')
				.expect(404)
				.end(done);
		});

    it('should return 404 response for invalid paths', function(done){
      guestAgent.get('/api/stuff')
        .expect(404)
        .end(done);
    })

	});

	// describe('Authenticated request', function () {
  //
	// 	var loggedInAgent;
  //
	// 	var userInfo = {
	// 		email: 'joe@gmail.com',
	// 		password: 'shoopdawoop'
	// 	};
  //
	// 	beforeEach('Create a user', function (done) {
	// 		User.create(userInfo, done);
	// 	});
  //
	// 	beforeEach('Create loggedIn user agent and authenticate', function (done) {
	// 		loggedInAgent = supertest.agent(app);
	// 		loggedInAgent.post('/login').send(userInfo).end(done);
	// 	});
  //
	// 	it('should get with 200 response and with an array as the body', function (done) {
	// 		loggedInAgent.get('/api/members/secret-stash').expect(200).end(function (err, response) {
	// 			if (err) return done(err);
	// 			expect(response.body).to.be.an('array');
	// 			done();
	// 		});
	// 	});
  //
	// });

});
