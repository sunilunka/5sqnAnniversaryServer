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
      stock: 10
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

  describe('instance methods', function(){

    describe('Product#updateStock', function(){

      it('should have a method .updateStock()', function(){
        expect(testProduct.updateStock).to.be.a('function');
      })

      it('should return a promise', function(){
        return expect(testProduct.updateStock('subtract', 5)).to.eventually.be.fulfilled;

      })

      it('should increase stock when "add" is the first argument', function(){
        var originalStock = testProduct.stock;
        return expect(testProduct.updateStock('add', 5)).to.eventually.have.property('stock', originalStock + 5);
      })

      it('should decrease stock when "subtract" is the first argument', function(){
        var originalStock = testProduct.stock;

        return expect(testProduct.updateStock('subtract', 5)).to.eventually.have.property('stock', originalStock - 5);
      })

      it('should return object with current stock, and prop nostock if subtract is more than available', function(){
        return expect(testProduct.updateStock('subtract', 69))       .to.eventually.eql({
          nostock: true,
          stock: 10
        })
      })
    })
  })
});
