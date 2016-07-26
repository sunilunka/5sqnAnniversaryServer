'use strict';
// Instantiate all models
var path = require('path');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
require('../../../server/db/models');
var Product = mongoose.model('Product');
var Variant = mongoose.model('Variant');
var Order = mongoose.model('Order');

var seedData = require(path.join(__dirname, '../seed-data/order-data.json'));
var testOrder = seedData.test_order;
var testProducts = seedData.seedProducts;
var testVariants = seedData.seedVariants;

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

  beforeEach('Create products', function(done){
    Product.create(testProducts)
    .then(function(){
      done()
    })
    .catch(done);
  })

  beforeEach('Create variants', function(done){
    Variant.create(testVariants)
    .then(function(){
      done();
    })
    .catch(done);
  })


  describe('POST "/"', function(){

    it('should append a unique order_ref string')

    it('should create a new order')

    describe('order product(s) have insufficient stock', function(){

      beforeEach('change quantity', function(){
        testOrder.products = testOrder.products.map(function(product){
          if(product.hasOwnProperty('variant_id')){
            product.quantity = 69;
          }
          return product;
        })
      })

      it('should not create a new order if one or more saves rejects', function(done){
        guestAgent.post('/api/orders')
        .send(testOrder)
        .expect(200)
        .end(function(err, res){
          if(err) return done(err);
          expect(Order.find({}).exec()).to.eventually.have.length(0).notify(done);
        })
      })

      it('should not modify product stock if one or more saves rejects', function(done){
        guestAgent.post('/api/orders')
        .send(testOrder)
        .expect(200)
        .end(function(err, res){
          if(err) return done(err);
          console.log("RESPONSE: ", res.body);
          Variant.find({}).exec()
          .then(function(variants){
            variants.forEach(function(v){
              expect(v.stock).to.equal(20);
            })
            done();
          })
          .catch(done);
        })
      })

      xit('should annotate insufficient stock orders with available stock', function(done){
        guestAgent.post('/api/orders')
        .send(testOrder)
        .expect(200)
        .end(function(err, res){
          if(err) return done(err);
          console.log("RES PRODUCTS: ", res.body);
          res.body.products.some(function(item){
            return item['nostock'] === true;
          })
          done();
        })
      })

      it('should annotate 0 to orders with no stock')
    })

  })

})
