// Instantiate all models
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
require('../../../server/db/models');
var Product = mongoose.model('Product');
var Variant = mongoose.model('Variant');

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

    it('should be an array', function(done){
      guestAgent.get('/api/products')
      .expect(200)
      .end(function(err, res){
        if(err) return done(err);
        expect(res.body).to.be.a('array');
        done();
      })
    })

	});

  describe('POST /new', function(){

    describe('Create new product', function(){

      it('should add to database with valid object', function(done){
        guestAgent.post('/api/products/new')
        .send({
          title: '75th Anniversary T-shirt',
          description: 'Best t-shirt ever!'
        })
				.expect(201)
        .end(function(err, res){
          if(err) return done(err);
          guestAgent.get('/api/products')
          .end(function(err, res){
            expect(res.body.length).to.equal(1);
            done();
          })
        })

      })

      it('should receive an error if object does not have required key', function(done){
        guestAgent.post('/api/products/new')
        .send({
          description: "This product is great!"
        })
				.expect(500)
        .end(function(err, res){
          // expect(res.status).to.equal(500);
          expect(res.hasOwnProperty('error')).to.equal(true);
          expect(res.error.text).to.equal('Product validation failed');
          done();
        })
      })

			describe('when variants are specified', function(){

				var productWithVariants = {
					title: "T-shirt",
					description: "A rad t-shirt",
					options: {
						size: ['XS', 'SM', 'M', 'L', 'XL'],
						color: ['black', 'blue']
					},
					variants: [
						{
							options: {
								size: 'L',
								color: 'black'
							},
							quantity: 10,
							price: 1000
						},
						{
							options: {
								size: 'SM',
								color: 'blue'
							},
							quantity: 20,
							price: 1000
						}
					]
				}

				it('should populate Variant collection', function(done){
					guestAgent.post('/api/products/new')
					.send(productWithVariants)
					.expect(201)
					.end(function(err, res){
						if(err) return done(err);
						Variant.where('product_id').equals(res.body._id)
						.exec()
						.then(function(result){
							expect(result).to.have.length(2);
							done();
						})
						.catch(done)
					})
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
