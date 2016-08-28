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


xdescribe('Emails Route', function () {

  var guestAgent;

  beforeEach('Create guest agent', function () {
    guestAgent = supertest.agent(app);
  });

  describe('POST /group route', function(){

    it('should return a 200 response when all emails have been sent successfully (will take a while, timeout is set at 15secs)', function(done){

      this.timeout(15000);

      guestAgent.post('/api/emails/group')
      .send({
        distributionList: 'attendees',
        subject: 'Testing',
        body: "We are testing some things here. \n Namely newlines and the like. \n\n To see if they present properly. \n\t If not, no matter."

      })
      .expect(200)
      .end(function(err, res){
        if(err) return done(err);
        done();
      })
    })

    it('should return a 200 response when all emails have been sent successfully when given an eventGuests db URL (will take a while, timeout is set at 15secs)', function(done){

      this.timeout(15000);

      guestAgent.post('/api/emails/group')
      .send({
        distributionList: 'eventGuests/-KChaDUmJ7V0Q_LrRrYl',
        subject: 'Testing',
        body: "We are testing some things here. \n Namely newlines and the like. \n\n To see if they present properly. \n\t If not, no matter."

      })
      .expect(200)
      .end(function(err, res){
        if(err) return done(err);
        done();
      })
    })

    it('should return a 200 response (202 in production) when all emails have been sent successfully when given an array of users', function(done){
      var users = [{
          email: 'sunil.unka@gmail.com',
          firstName: 'Sunil',
          lastName: 'Unka',
        },
        {
          email: 'seawolf007@virginbroadband.com.au',
          firstName: 'Calvin',
          lastName: 'Hobbes'
        }];

      guestAgent.post('/api/emails/group')
      .send({
        distributionList: users,
        subject: 'Testing',
        body: "We are testing some things here. \n Namely newlines and the like. \n\n To see if they present properly. \n\t If not, no matter."
      })
      .expect(200)
      .end(function(err, res){
        if(err) done(err);
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

  describe('POST /event-payment-success', function(){

    it('should return status 200 (202 in production) response when email sent successfully', function(done){
      guestAgent.post('/api/emails/event-payment-success')
      .send({
        user: {
          email: 'sunil.unka@virginmedia.com',
          firstName: 'Sunil',
          lastName: 'Unka'
        },
        evt: {
          name: 'Black Tie Dinner',
          location: 'MOTAT',
          startTime: {
            hours: '18',
            minutes: '0'
          },
          date: 'Saturday 24 September 2016'
        }
      })
      .expect(200)
      .end(function(err, res){
        if(err) return done(err);
        done();
      })
    })

  })

})
