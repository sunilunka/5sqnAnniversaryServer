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

  describe('POST /', function(){

    it('should create a new variant', function(done){
      rawVariant.product_id = testProduct._id;
      guestAgent.post('/api/products/' + testProduct._id + '/variants')
      .send(rawVariant)
      .expect(201)
      .end(function(err, res){
        if(err) return done(err);
        expect(res.body).to.have.property('_id');
        done();
      })
    })

    it('should add _id to product variants array', function(done){
      rawVariant.product_id = testProduct._id;
      guestAgent.post('/api/products/' + testProduct._id + '/variants')
      .send(rawVariant)
      .expect(201)
      .end(function(err, res){
        if(err) return done(err);
        Product.findById(res.body.product_id)
        .then(function(product){
          expect(product.variants).to.include(res.body._id);
          done();
        })
      })
    })

    it('should add any new option and/or key-value pair to product')

  })

  describe('GET /:variantId', function(){
    it('should return variant')
  })

  describe('PUT /:variantId', function(){
    it('should update the requested variant')
  })


  describe('PUT /:variantId/stock', function(){
    it('should ')
  })

  describe('DELETE /:variantId', function(){
    it('should remove the specified variant')
  })

})
