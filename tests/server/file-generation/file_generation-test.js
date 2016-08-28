'use strict';

var path = require('path');

var Firebase = require(path.join(__dirname, '../../../server/db/fire-db'));

var fileGenMethods = require(path.join(__dirname, '../../../server/app/file-generation'));

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var sinon = require('sinon');

var testId = 'I0cr7ykBtISiw4kO68sESRfTqTp1';
var testIdNonManager = 'zj64GsClZ5YYGg4hFmhMZmG4b183';
var fakeId = 'xh69GSClZ5XXGg4hFmhMZmH4b143';
var testEventId = "-KChe4MrYH9m3YFozdf6";
var paidUserId = 'xhcGAgGpReMUxMj5IRhobzW4B4E3';

describe('File Generation methods', function(){

  describe('#generateEventGuestList()', function(){
    it('should be a function', function(){
      expect(fileGenMethods.generateEventGuestList).to.be.a('function');
    })

    it('should generate a new HTML file', function(done){
      expect(fileGenMethods.generateEventGuestList(testEventId)).to.eventually.be.ok.notify(done);
    })
  })
})
