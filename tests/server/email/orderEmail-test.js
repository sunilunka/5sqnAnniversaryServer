'use strict';

var path = require('path');
var mailer = require(path.join(__dirname, '../../../server/app/email'));

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

// var sgApiKey = require(path.join(__dirname, '../../../server/app/configure/authentication/sendgrid.json')).SEND_GRID_AUTH;
// var sg = require('sendgrid')(sgApiKey);
var supertest = require('supertest');
var app = require('../../../server/app');


describe('Order email functionality', function(){
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

  describe('#generateNewAttendeeEmail', function(){

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
})
