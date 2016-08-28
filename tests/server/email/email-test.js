'use strict';

var path = require('path');
var mailer = require(path.join(__dirname, '../../../server/app/email'));

var plainTextMethods = require(path.join(__dirname, '../../../server/app/email/plainText_templating'))

var mongoose = require('mongoose');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var fireMethods = require(path.join(__dirname, '../../../server/db/fire-db'));

var seedData = require(path.join(__dirname, '../seed-data/order-data.json'));
var testOrder = seedData.test_order;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);


var supertest = require('supertest');
var app = require('../../../server/app');


xdescribe('Plain Text Templating Methods', function(){

  describe('#parseTimes()', function(){
    it('should return a time value with single character strings prepended by zero', function(){
      expect(plainTextMethods.parseTimes(['1', '0'])).to.equal('0100');
    });
  })
})

xdescribe('Order email functionality', function(){
  describe('#generateOrderSuccessEmail', function(){
    it('should be a function', function(){
      expect(mailer.generateOrderSuccessEmail).to.be.a('function');
    })

    it('should receive a status of 200 (202 in production) when successful', function(done){
      mailer.generateOrderSuccessEmail(testOrder)
      .then(function(status){
        /* Expect 200 based on sandbox mode for sendgrid for successful submission */
        expect(status).to.equal(200);
        done();
      })
      .catch(done);
    })
  })

  xdescribe('#generateNewAttendeeEmail', function(){

    var userDetails;

    beforeEach('get user details', function(done){
      fireMethods.getEmailAssociatedUser('sunil.unka@gmail.com')
      .then(function(userData){
        userDetails = userData;
        done();
      })
      .catch(done);
    })

    it('should be a function', function(){
      expect(mailer.generateNewAttendeeEmail).to.be.a('function');
    })

    it('should receive a status of 200 (202 in production) when successful', function(done){

      mailer.generateNewAttendeeEmail(userDetails)
      .then(function(status){
        expect(status).to.equal(200);
        done();
      })
      .catch(done);
    })
  })

  xdescribe('#generateOrderDispatchEmail', function(){

    it('should be a function', function(){
      expect(mailer.generateOrderDispatchEmail).to.be.a('function');
    })

    it('should return 200 (202 in production or when sandbox mode not set) when successful', function(done){

      testOrder.trackingData = 'EA114499210NZL';

      mailer.generateOrderDispatchEmail(testOrder)
      .then(function(status){
        expect(status).to.equal(200);
        done();
      })
      .catch(done);
    })

  })

  xdescribe('#generateOrderPaymentConfirmation', function(){
    it('should be a function', function(){
      expect(mailer.generateOrderPaymentConfirmation).to.be.a('function');
    })

    it('should return 200 (202 in production or when sandbox mode not set) when successful', function(done){
      mailer.generateOrderPaymentConfirmation(testOrder)
      .then(function(status){
        expect(status).to.equal(200);
        done();
      })
      .catch(done);
    })
  })

})
