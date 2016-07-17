// Instantiate all models
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
require('../../../server/db/models');
var Product = mongoose.model('Product');
var Variant = mongoose.model('Variant');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var sinon = require('sinon');

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Product variants route', function(){

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

  var testProduct;

  beforeEach('Create dummy product and variant', function(done){
    Product.create({
      title: "T-shirt",
      description: "A rad t-shirt",
      options: {
        size: ['XS', 'SM', 'M', 'L', 'XL'],
        color: ['black', 'blue']
      }
    })
    .then(function(product){
      testProduct = product;
      done();
    })
    .catch(done);
  })

  var rawVariant = {
    options: {
      size: 'SM',
      color: 'blue'
    },
    stock: 20,
    price: 1000
  }


  describe('PUT /:variantId/stock', function(){
    it('should update stock')
  })


})
