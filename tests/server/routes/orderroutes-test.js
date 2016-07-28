'use strict';
// Instantiate all models
var path = require('path');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
require('../../../server/db/models');
var Product = mongoose.model('Product');
var Variant = mongoose.model('Variant');
var Order = mongoose.model('Order');
var Firebase = require(path.join(__dirname, '../../../server/db/fire-db'));

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


  describe('GET "/""', function(){

    it('sends a 401 response if the user is not a manager', function(done){
      guestAgent.get('/api/orders')
      .send({
        user_id: testIdNonManager
      })
      .expect(401)
      .end(function(err, res){
        if(err) return done(err);
        done();
      })
    })

    it('sends a 200 response with an array of results if user is a manager', function(done){
      guestAgent.get('/api/orders')
      .send({
        user_id: testId
      })
      .expect(200)
      .end(function(err, res){
        if(err) return done(err);
        expect(res.body).to.be.a('array');
        done();
      })
    })

  })

  describe('POST "/new"', function(){

    describe('valid order', function(){

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

      it('should create a new order', function(done){
        guestAgent.post('/api/orders/new')
        .send(testOrder)
        .expect(201)
        .end(function(err, res){
          if(err) return done(err);
          expect(Order.find({}).exec()).to.eventually.have.length(1).notify(done);
        })
      })

      it('should append a unique order_ref string', function(done){
        guestAgent.post('/api/orders/new')
        .send(testOrder)
        .expect(201)
        .end(function(err, res){
          if(err) return done(err);
          expect(res.body.order_ref).to.equal('5SQN-75-' + (originalValue + 1));
          done();
        })
      })
    })

    describe('order product(s) have insufficient stock', function(){

      beforeEach('change quantity', function(){
        testOrder.products = testOrder.products.map(function(product){
          if(product.hasOwnProperty('variant_id')){
            product.quantity = 69;
          }
          return product;
        })
      })

      afterEach('reset quantities', function(){
        testOrder.products[0].quantity = 2;
        testOrder.products[1].quantity = 1;
      })

      it('should not create a new order if one or more saves rejects', function(done){
        guestAgent.post('/api/orders/new')
        .send(testOrder)
        .expect(200)
        .end(function(err, res){
          if(err) return done(err);
          expect(Order.find({}).exec()).to.eventually.have.length(0).notify(done);
        })
      })

      it('should not modify product stock if one or more saves rejects', function(done){
        guestAgent.post('/api/orders/new')
        .send(testOrder)
        .expect(200)
        .end(function(err, res){
          if(err) return done(err);
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

      it('should annotate insufficient stock orders with available stock', function(done){
        guestAgent.post('/api/orders/new')
        .send(testOrder)
        .expect(200)
        .end(function(err, res){
          if(err) return done(err);
          expect(res.body.products.some(function(item){
            return item.hasOwnProperty('amendedQuantity');
          })).to.be.ok;
          done();
        })
      })
    })
  })

  describe('"/:orderId" route', function(){

    var savedOrder;
    var originalStock;

    beforeEach('create new order', function(done){

      guestAgent.post('/api/orders/new')
      .send(testOrder)
      .expect(201)
      .end(function(err, res){
        if(err) return done(err);
        savedOrder = res.body;
        done();
      })
    })

    beforeEach('get variant stock', function(done){
      Variant.find({
        options: {
          size: "L",
          colour: "BLACK"
        }
      })
      .exec()
      .then(function(variants){
        originalStock = variants[0].stock;
        done();
      })
      .catch(done);
    })

    describe('GET "/:orderId"', function(){

      it('should return the selected order', function(done){
        guestAgent.get('/api/orders/' + savedOrder._id)
        .expect(200)
        .end(function(err, res){
          if(err) return done(err);
          expect(res.body.user_id).to.equal(testId);
          done();
        })
      })
    })

    describe('PUT "/:orderId"', function(){

      it('should apply changes and return updated order', function(done){
        guestAgent.put('/api/orders/' + savedOrder._id)
        .send({
          orderStatus: 'ready',
          paymentState: 'paid'
        })
        .expect(200)
        .end(function(err, res){
          if(err) return done(err);
          expect(res.body).to.have.property('orderStatus', 'ready');
          expect(res.body).to.have.property('paymentState', 'paid');
          done();
        })
      })

      it('should add stock to products in the order if orderStatus is "cancelled"', function(done){
        guestAgent.put('/api/orders/' + savedOrder._id)
        .send({
          orderStatus: 'cancelled'
        })
        .expect(200)
        .end(function(err, res){
          if(err) return done(err);
          expect(res.body).to.have.property('orderStatus', 'cancelled');
          Variant.find({
            options: {
              size: "L",
              colour: "BLACK"
            }
          }).exec()
          .then(function(variants){
            expect(variants[0].stock).to.equal(20);
            done();
          })
          .catch(done);
        })
      })
    })
  })
})
