/* Get the route helpers file */
path = require('path');
productRouteHelpers = require(path.join(__dirname, '../../../server/app/routes/product-route-helpers'));
/* Instantiate models to check saving to db */
// var _ = require('lodash');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
require('../../../server/db/models');
var Product = mongoose.model('Product');
var Variant = mongoose.model('Variant');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

describe('Product route helper methods', function(){

  beforeEach('Establish DB connection', function(done){
    if(mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  })

  afterEach('Clear test database', function(done){
    clearDB(done);
  })

  describe('Product and Variant helper methods', function(){

    var productWithVariants = {
      title: "T-shirt",
      description: "A rad t-shirt",
      options: {
        size: ['XS', 'SM', 'M', 'L', 'XL'],
        color: ['black', 'blue']
      },
      price: "10.00"
    }

    var testProduct;

    beforeEach('Create new product', function(done){
      Product.create(productWithVariants)
      .then(function(product){
        testProduct = product;
        done();
      })
      .catch(done);
    })

    var variants = [
      {
        options: {
          size: 'L',
          color: 'black'
        },
        stock: 10,
        price: "10.00"
      },
      {
        options: {
          size: 'SM',
          color: 'blue'
        },
        stock: 20,
        price: "10.00"
      }
    ];

    describe('#processVariants()', function(){

      var processVariantsOutput;

      it('should be a function', function(){
        console.log("ROUTE HELPERS: ", productRouteHelpers);
        expect(productRouteHelpers.processVariants).to.be.a('function');
      })

      it('Should return an array', function(){
        expect(productRouteHelpers.processVariants(testProduct, variants)).to.be.a('array');
      })

      it('Each object should have the parent product._id in the product_id field', function(){
        expect(productRouteHelpers.processVariants(testProduct, variants)[1]).to.have.property('product_id', testProduct['_id']);
      })

      it('Should append the parent product price when no price is given', function(){
        var variant = [{
                options: {
                  size: 'SM',
                  color: 'blue'
                },
                stock: 20
              }]

        expect(productRouteHelpers.processVariants(testProduct, variant)[0]).to.have.property('price', '10.00');
      })
    })

    describe('#addVariantRefToParent()', function(){

      var referenceVars;

      beforeEach('seed db with variants', function(done){
        var updatedVars = variants.map(function(variant){
          variant.product_id = testProduct._id;
          return variant;
        })

        Variant.create(updatedVars)
        .then(function(variants){
          referenceVars = variants;
          done();
        })
        .catch(done);
      })

      it('should be a function', function(){
        expect(productRouteHelpers.addVariantRefToParent).to.be.a('function')
      })

      it('should populate variants array of parent product', function(done){

        productRouteHelpers.addVariantRefToParent(testProduct, referenceVars)
        testProduct.save()
        .then(function(product){
          expect(testProduct.variants.indexOf(referenceVars[1]._id)).to.equal(1);
          done();
        })
        .catch(done);
      })
    })

    describe('#checkVariantsOnUpdate()', function(){
      it('should be a function', function(){
        expect(productRouteHelpers.checkVariantsOnUpdate).to.be.a('function');
      })
    })
  })
})
