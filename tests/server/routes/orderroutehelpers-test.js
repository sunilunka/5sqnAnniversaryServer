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
var Firebase = require(path.join(__dirname, '../../../server/db/fire-db'));
var testProducts = testOrderData.seedProducts;
var testVariants = testOrderData.seedVariants;
var _ = require('lodash');
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

  describe('#generateOrderRef()', function(){

    var originalValue;

    beforeEach('Get current order number', function(done){
      Firebase.dbConnect('/orderRef')
      .once('value')
      .then(function(snapshot){
        var snap = snapshot.val();
        if(!snap){
          originalValue = 4999;
        } else {
          originalValue = snap;
        }
        done();
      })
      .catch(done);
    })

    it('should be a function', function(){
      expect(orderRouteHelpers.generateOrderRef).to.be.a('function');
    })

    it('should return a formatted string with unique ref number', function(){
      return expect(orderRouteHelpers.generateOrderRef()).to.eventually.equal('5SQN-75-' + (originalValue + 1));
    })
  })

  describe('#modifyProductStock()', function(){

    it('should be a function', function(){
      expect(orderRouteHelpers.modifyProductStock).to.be.a('function');
    })

    it('should return an array', function(){
      return expect(orderRouteHelpers.modifyProductStock(testOrder.products)).to.eventually.be.an('array');
    })
  })

  describe('#amendOrderQuantities()', function(){
    it('should be a function', function(){
      expect(orderRouteHelpers.amendOrderQuantities).to.be.a('function');
    })

    it('should return an array of items', function(){
      return expect(orderRouteHelpers.amendOrderQuantities(testOrder.products)).to.eventually.be.a('array');
    })

    it('should return append the key "amendedQuantity" to an item that requests a quantity in excess of current stock', function(done){
      testOrder.products[0].quantity = 50;

      var targetProduct = testOrder.products[0];

      orderRouteHelpers.amendOrderQuantities(testOrder.products)
      .then(function(amendedProducts){
        var targetProductIdx = _.findIndex(amendedProducts, function(product){
          return product.display_options === targetProduct.display_options;
        });
        expect(amendedProducts[targetProductIdx]).to.have.property('amendedQuantity', 20);
        /* Reset test order products back to 2 to ensure no further tests are affected. */
        testOrder.products[0].quantity = 2;
        done();
      })
      .catch(done)
    })
  })

  describe('#restockProducts()', function(){

    var originalStockOne;

    beforeEach('Get variant stock', function(done){
      Variant.find({
        options: {
          size: "L",
          colour: "BLACK"
        }
      }).exec()
      .then(function(variants){
        originalStockOne = variants[0].stock;
        done();
      })
      .catch(done);
    })

    it('should be a function', function(){
      expect(orderRouteHelpers.restockProducts).to.be.a('function');
    })

    it('should return an array', function(){
      return expect(orderRouteHelpers.restockProducts(testOrder.products)).to.eventually.be.a('array');
    })

    it('should add the requested quantity to a product or variant', function(done){
      orderRouteHelpers.restockProducts(testOrder.products)
      .then(function(restockedProducts){
        return Variant.find({
          options: {
            size: "L",
            colour: "BLACK"
          }
        }).exec();
      })
      .then(function(variants){
        expect(variants[0].stock).to.equal(originalStockOne + 2);
        done();
      })
      .catch(done);
    })
  })

  describe('#emailOrderStateUpdate()', function(){

    it('should be a function', function(){
      expect(orderRouteHelpers.emailOrderStateUpdate).to.be.a('function');
    })  
  })

})
