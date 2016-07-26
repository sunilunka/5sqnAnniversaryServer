/* Get the route helpers file */
path = require('path');
orderRouteHelpers = require(path.join(__dirname, '../../../server/app/routes/order-route-helpers'));
var _ = require('lodash');
var testOrderData = require(path.join(__dirname, '../test-data/order-data.json'));
/* Instantiate models to check saving to db */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
require('../../../server/db/models');
var Product = mongoose.model('Product');
var Variant = mongoose.model('Variant');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

describe('Order route helper methods', function(){

  var testOrder = testOrderData.test_order;
  testOrder.email = "sunil.unka@gmail.com";

  describe('#removeIdFields()', function(){

    it('should be a function', function(){
      expect(orderRouteHelpers.removeIdFields).to.be.a('function');
    })

    it('should return an array of products with no "_id" keys', function(){
      orderRouteHelpers.removeIdFields(testOrder.products)
      .forEach(function(item){
        expect(item).to.not.have.property('_id');
      })
    })
  })
})
