// Instantiate all models
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
require('../../../server/db/models');
var Product = mongoose.model('Product');
var Variant = mongoose.model('Variant');
var Order = mongoose.model('Order');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

var testId = 'I0cr7ykBtISiw4kO68sESRfTqTp1';
var testIdNonManager = 'zj64GsClZ5YYGg4hFmhMZmG4b183';

describe('Order routes', function(){

  describe('POST "/"', function(){

    it('should strip all "_id" keys from products')

    describe('order product(s) have insufficient stock', function(){
      it('should return the original order')

      it('should annotate insufficient stock orders with available stock')

      it('should annotate 0 to orders with no stock')
    })

    it('should append a unique order_ref string')

    it('should create a new order')
  })

})
