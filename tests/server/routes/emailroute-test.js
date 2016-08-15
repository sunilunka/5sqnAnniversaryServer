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


var supertest = require('supertest');
var app = require('../../../server/app');

var testId = 'I0cr7ykBtISiw4kO68sESRfTqTp1';


describe('Emails Route', function () {

  var guestAgent;

  beforeEach('Create guest agent', function () {
    guestAgent = supertest.agent(app);
  });

  describe('POST /group route', function(){

    it('should return a 200 response when all emails have been sent successfully', function(done){
      guestAgent.post('/api/emails/group')
      .send({
        distributionList: 'attendees/' + testId
      })
      .expect(200)
      .end(function(err, res){
        if(err) return done(err);
        done();
      })
    })
  })

  describe('POST /register-success route', function(){

    it('should return a 200 (202 in production) response when email has been sent successfully', function(done){

      guestAgent.post('/api/emails/register-success')
      .send({
        userId: testId
      })
      .expect(200)
      .end(function(err, res){
        if(err) return done(err);
        done();
      })
    })
  })

})
