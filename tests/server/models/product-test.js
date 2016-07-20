var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Product = mongoose.model('Product');

describe('Product model', function () {
  beforeEach('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  var testProduct;

  beforeEach('Create a dummy product', function(done){
    Product.create({
      title: 'P-8 Poseidon',
      description: 'Bad-ass sub hunting aircraft',
      stock: 10,
      price: "1200.35"
    })
    .then(function(product){
      testProduct = product;
      done();
    })
    .catch(done);
  })

  afterEach('Clear test database', function (done) {
      clearDB(done);
  });

  it('should exist', function(){
    expect(Product).to.be.a('function');
  })

  it('should have a default "deliverable" value of false', function(){
    expect(testProduct.deliverable).to.be.false
  })

  describe('quantity management', function(){

    it('should throw a validation error if stock will go below zero', function(done){
      testProduct.stock = (testProduct.stock - 12)
      testProduct.save()
      .catch(function(err){
        expect(err.errors.stock.message).to.equal('No stock available');
        done();
      });
    })
  })
});
