/* Get the route helpers file */
path = require('path');
orderRouteHelpers = require(path.join(__dirname, '../../../server/app/routes/order-route-helpers'));
var _ = require('lodash');
var testOrderData = require(path.join(__dirname, '../seed-data/order-data.json'));
/* Instantiate models to check saving to db */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
require('../../../server/db/models');
var Product = mongoose.model('Product');
var Variant = mongoose.model('Variant');

var testProducts = testOrderData.seedProducts;
var testVariants = testOrderData.seedVariants;

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

describe('Order route helper methods', function(){

  var testOrder = testOrderData.test_order;
  testOrder.email = 'sunil.unka@gmail.com';

  beforeEach('create products', function(done){
    Product.create(testProducts)
    .then(function(createdProducts){
      done();
    })
    .catch(done)
  })

  beforeEach('create variants', function(done){
    Variant.create(testVariants)
    .then(function(createdVariants){
      done()
    })
    .catch(done);
  })

  afterEach('clear database', function(done){
    clearDB(done);
  })

  describe('#removeConflictingKeys()', function(){

    it('should be a function', function(){
      expect(orderRouteHelpers.removeConflictingKeys).to.be.a('function');
    })

    it('should return an array of products with no "_id"  or "__v" keys', function(){
      orderRouteHelpers.removeConflictingKeys(testOrder.products)
      .forEach(function(item){
        expect(item).to.not.have.ownProperty('_id');
        expect(item).to.not.have.ownProperty('__v');
      })
    })
  })

  describe('#modifyProductStock()', function(){

    it('should return an array', function(){
      return expect(orderRouteHelpers.modifyProductStock(testOrder.products)).to.eventually.be.an('array');
    })
  })

})
