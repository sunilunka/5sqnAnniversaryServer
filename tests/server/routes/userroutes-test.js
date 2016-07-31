'use strict';
// Instantiate all models
var path = require('path');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
require('../../../server/db/models');
var Product = mongoose.model('Product');
var Variant = mongoose.model('Variant');
var Order = mongoose.model('Order');
var Firebase = require(path.join(__dirname, '../../../server/db/fire-db'));

var seedData = require(path.join(__dirname, '../seed-data/order-data.json'));
var testOrder = seedData.test_order;
var testProducts = seedData.seedProducts;
var testVariants = seedData.seedVariants;

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

var testId = 'I0cr7ykBtISiw4kO68sESRfTqTp1';
var testIdNonManager = 'zj64GsClZ5YYGg4hFmhMZmG4b183';

describe('User routes', function(){

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

  beforeEach('Create products', function(done){
    Product.create(testProducts)
    .then(function(){
      done()
    })
    .catch(done);
  })

  beforeEach('Create variants', function(done){
    Variant.create(testVariants)
    .then(function(){
      done();
    })
    .catch(done);
  })

  describe('User routes', function(){


    var savedOrder;

    beforeEach('create new order', function(done){

      guestAgent.post('/api/orders/new')
      .send(testOrder)
      .expect(201)
      .end(function(err, res){
        if(err) return done(err);
        savedOrder = res.body;
        done();
      })
    })

    describe('GET "/verifyemail"', function(){

      it('should return user details if the user exists', function(done){
        guestAgent.get('/api/users/verifyemail?email=sunil.unka@gmail.com')
        .expect(200)
        .end(function(err, res){
          if(err) return done(err);
          expect(res.body).to.have.property('user_id', testId);
          done();
        })
      })

      it('should return 204 if the user does not exist', function(done){
        guestAgent.get('/api/users/verifyemail?email=cc@sg.com')
        .expect(204)
        .end(function(err, res){
          if(err) return done(err);
          done();
        })
      })
    })

    describe('GET "/:userId/orders"', function(){

      it('should return an array of the user orders', function(done){
        guestAgent.get('/api/users/' + testId + '/orders')
        .expect(200)
        .end(function(err, res){
          if(err) return done(err);
          expect(res.body).to.have.length(1);
          done();
        })
      })

    })

  })

})
