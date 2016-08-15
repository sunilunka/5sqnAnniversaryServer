'use strict';

var path = require('path');
var fireMethods = require(path.join(__dirname, '../../db/fire-db'));

var routeHelpers = {};

routeHelpers.getAddresseeInformation = function(dbPath, next){
  return fireMethods.dbConnect(dbPath).once('value')
  .then(function(snapshot){
    var data = snapshot.val();
    if(data) return data;
  })
  .catch(next);
}

routeHelpers.dispatchGroup = function(addressees, emailObj){

}

routeHelpers.dispatchGroupEmail = function(addresseeObj, emailObj){
  var toDispatch = Object.keys(addresseeObj);
  var groupNum = 0;

  while(groupNum < 11){
    // toDispatch.
  }



}

module.exports = routeHelpers;
