'use strict';

var path = require('path');
var mailer = require(path.join(__dirname, '../../../server/app/email'));

var mongoose = require('mongoose');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var seedData = require(path.join(__dirname, '../seed-data/order-data.json'));
var testOrder = seedData.test_order;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');


describe('Order email functionality', function(){
  describe('#generateOrderSuccessEmail', function(){
    it('should be a function', function(){
      expect(mailer.generateOrderSuccessEmail).to.be.a('function');
    })

    it('should return a new mail object', function(){
      expect(mailer.generateOrderSuccessEmail(testOrder)).to.be.a('Object')
    })
  })
})
