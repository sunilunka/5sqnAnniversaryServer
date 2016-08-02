// Instantiate all models
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
require('../../../server/db/models');
var Product = mongoose.model('Product');
var Variant = mongoose.model('Variant');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var sinon = require('sinon');

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

var testId = 'I0cr7ykBtISiw4kO68sESRfTqTp1';
var testIdNonManager = 'zj64GsClZ5YYGg4hFmhMZmG4b183';

describe('Product variants route', function(){

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

  var testProduct;
  var testVariant;



  describe('PUT /:variantId/stock', function(){

    beforeEach('Create dummy product and variant', function(done){

      var rawVariant = {
        options: {
          size: 'SM',
          color: 'blue'
        },
        stock: 20,
        price: "10.00"
      }

      var body = {
        user_id: testId,
        product: {
          title: "T-shirt",
          description: "A rad t-shirt",
          options: {
            size: ['XS', 'SM', 'M', 'L', 'XL'],
            color: ['black', 'blue']
          },
          variants: [rawVariant]
        }
      }

      guestAgent.post('/api/products/new')
      .send(body)
      .expect(201)
      .end(function(err, res){
        if(err) return done(err);
        testProduct = res.body;
        testVariant = res.body.variants[0];
        done();
      })
    })

    it('should add the key "nostock" to the returned product if attempt to remove more items than number in stock', function(done){
      guestAgent.put('/api/variants/' + testVariant + '/stock')
      .send({
        operation: 'subtract',
        amount: 69
      })
      .expect(200)
      .end(function(err, res){
        if(err) return done(err);
        expect(res.body).to.have.ownProperty('nostock', true);
        done();
      })
    })
  })


})
