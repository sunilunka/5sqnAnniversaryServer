/* Get the route helpers file */
path = require('path');
routeHelpers = require(path.join(__dirname, '../../../server/app/routes/route-helpers'));
/* Instantiate models to check saving to db */

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
require('../../../server/db/models');
var Product = mongoose.model('Product');
var Variant = mongoose.model('Variant');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

describe('Route Helpers', function(){

  beforeEach('Establish DB connection', function(done){
    if(mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  })

  afterEach('Clear test database', function(done){
    clearDB(done);
  })

  describe('processVariants function', function(){

    var productWithVariants = {
      title: "T-shirt",
      description: "A rad t-shirt",
      options: {
        size: ['XS', 'SM', 'M', 'L', 'XL'],
        color: ['black', 'blue']
      },
      price: 1000
    }

    var testProduct;

    beforeEach('Create new product', function(done){
      Product.create(productWithVariants)
      .then(function(product){
        testProduct = product;
        done();
      })
    })

    var variants = [
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
    ];

    var processVariantsOutput;

    beforeEach('run the target function', function(){
      processVariantOutputs = routeHelpers.processVariants(testProduct, variants);
    })

    it('Should return an array', function(){
      expect(processVariantOutputs).to.be.a('array');
    })

    it('Each object should have the test product id in the product_id field', function(){
      expect(processVariantOutputs[1]).to.have.property('product_id', testProduct['_id']);
    })

    it('Should append the parent product price when no price is given', function(){
      var variant = [{
              options: {
                size: 'SM',
                color: 'blue'
              },
              quantity: 20
            }]

      expect(routeHelpers.processVariants(testProduct, variant)[0]).to.have.property('price', testProduct.price);
    })
  })
})
