'use strict';

var path = require('path');

var Firebase = require(path.join(__dirname, '../../../server/db/fire-db'));

var fileGenMethods = require(path.join(__dirname, '../../../server/app/file-generation'));

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var sinon = require('sinon');

var supertest = require('supertest');
var app = require('../../../server/app');

var testId = 'I0cr7ykBtISiw4kO68sESRfTqTp1';
var testIdNonManager = 'zj64GsClZ5YYGg4hFmhMZmG4b183';
var fakeId = 'xh69GSClZ5XXGg4hFmhMZmH4b143';
var testEventId = "-KChe4MrYH9m3YFozdf6";
var paidUserId = 'xhcGAgGpReMUxMj5IRhobzW4B4E3';

describe('File Generation Routes', function(){

  var guestAgent;

  beforeEach('Create guest agent', function () {
    guestAgent = supertest.agent(app);
  });

  describe('GET /guestlist/:eventId', function(){
    it('should return an HTML page', function(){
      guestAgent.get('/api/generated-files/guest-list/' + testEventId)
      .expect(200)
      .end(function(err, res){
        console.log("RES BODY: ", res.body);
      })
    })
  })
})
