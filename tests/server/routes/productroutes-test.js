// Instantiate all models
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
require('../../../server/db/models');
var User = mongoose.model('Product');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Products Route', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

  var guestAgent;

  beforeEach('Create guest agent', function () {
    guestAgent = supertest.agent(app);
  });

	describe('GET /', function () {

		it('should get a 200 response', function (done) {
			guestAgent.get('/api/products')
				.expect(200)
				.end(done);
		});

    it('response should be an array with no entries', function(done){
      guestAgent.get('/api/products')
      .expect(200)
      .end(function(err, res){
        if(err) return done(err);
        expect(res.body).to.be.a('array');
        expect(res.body.length, 'Array [res.body.length]').to.equal(0);
        done();
      })
    })

	});

  describe('POST /', function(){

    describe('Product create', function(){

      it('should create a product when a valid object is sent', function(done){
        guestAgent.post('/api/products/new')
        .send({
          title: '75th Anniversary T-shirt',
          description: 'Best t-shirt ever!'
        })
        .end(function(err, res){
          if(err) return done(err);
          guestAgent.get('/api/products')
          .end(function(err, res){
            expect(res.body.length).to.equal(1);
            done();
          })
        })

      })

      it('should receive an error if no title is sent', function(done){
        guestAgent.post('/api/products/new')
        .send({
          description: "This product is great!"
        })
        .end(function(err, res){
          expect(res.status).to.equal(500);
          expect(res.hasOwnProperty('error')).to.equal(true);
          expect(res.error.text).to.equal('Product validation failed');
          done();
        })
      })



    })
  })

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
