var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var chai = require('chai')
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Product = mongoose.model('Product');
var Variant = mongoose.model('Variant');

describe('Variant model', function () {
  beforeEach('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  afterEach('Clear test database', function (done) {
      clearDB(done);
  });

  it('should exist', function(){
    expect(Variant).to.be.a('function');
  })


  describe('instance and virtual methods', function(){

    var testProduct;
    var testVariant;

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
        Variant.create([
    			{
            product_id: product._id,
    				options: {
    					size: 'L',
    					color: 'black'
    				},
    				stock: 10,
    				price: '10.00'
    			},
    			{
            product_id: product._id,
    				options: {
    					size: 'SM',
    					color: 'blue'
    				},
    				stock: 20,
    				price: '10.00'
    			}
    		]).
        then(function(variants){
          testVariant = variants[0];
          done();
        })
      })
      .catch(done);
    })

    describe('Variant#updateStock', function(){

      it('should have a method .updateStock()', function(){
        expect(testVariant.updateStock).to.be.a('function');
      })

      it('should return a promise', function(){
        return expect(testVariant.updateStock('subtract', 5)).to.eventually.be.fulfilled;
      })

      it('should increase stock when "add" is the first argument', function(){
        var originalStock = testVariant.stock;
        return expect(testVariant.updateStock('add', 5)).to.eventually.have.property('stock', originalStock + 5);
      })

      it('should decrease stock when "subtract" is the first argument', function(){
        var originalStock = testVariant.stock;

        return expect(testVariant.updateStock('subtract', 5)).to.eventually.have.property('stock', originalStock - 5);
      })

      it('should return reject, with product and prop nostock if subtract is more than available', function(done){
        // return expect(testVariant.updateStock('subtract', 69)).to.eventually.be.rejected;
        testVariant.updateStock('subtract', 69)
        .then(function(product){
          return product;
          done();
        })
        .catch(function(rejection){
          console.log("REJECTION: ", rejection);
          done();
        })
      })
    })
  })
});
