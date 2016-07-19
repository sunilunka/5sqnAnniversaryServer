var path = require('path');

var Firebase = require(path.join(__dirname, '../../../server/db/fire-db'));

var FirebaseInit = require(path.join(__dirname, '../../../server/app/configure/authentication/firebase_config'))

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var sinon = require('sinon');

var testId = 'I0cr7ykBtISiw4kO68sESRfTqTp1';
var testIdNonManager = 'zj64GsClZ5YYGg4hFmhMZmG4b183';
var fakeId = 'xh69GSClZ5XXGg4hFmhMZmH4b143';

describe('Firebase dependent methods', function(){
  /* Interactions with firebase db commonly take longer than requests from local host, so increase timeout */
  this.timeout(8000);

  before('Initiate Firebase app', function(){
    FirebaseInit();
  })

  describe('#getOneAttendeeRef()', function(){
    it('should return a user when passed a valid id', function(done){
      expect(Firebase.getOneAttendeeRef(testId)).to.eventually.have.property('email', 'sunil.unka@gmail.com').notify(done);
    })

    it('should return null when no user found', function(done){
      expect(Firebase.getOneAttendeeRef(fakeId)).to.eventually.be.null.notify(done);
    })
  })

  describe('#checkAuthorisedManager()', function(){
    it('should return true if the user is designated a manager', function(done){
      expect(Firebase.checkAuthorisedManager(testId)).to.eventually.be.true.notify(done);
    })

    it('should return false if the user is not designated a manager', function(done){
      expect(Firebase.checkAuthorisedManager(testIdNonManager)).to.eventually.be.false.notify(done);
    })
  })

  describe('#getEmailAssociatedUser()', function(){
    it('should return the associated user when a valid email address is supplied', function(done){
      expect(Firebase.getEmailAssociatedUser('sunil.unka@gmail.com')).to.eventually.equal(testId).notify(done);
    })

    it('should return null when no user is associated with the address', function(done){
      expect(Firebase.getEmailAssociatedUser('bob.unka@gmail.com')).to.eventually.be.null.notify(done);
    })
  })

})