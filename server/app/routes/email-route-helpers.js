'use strict';

var path = require('path');
var fireMethods = require(path.join(__dirname, '../../db/fire-db'));

var routeHelpers = {};

routeHelpers.getAddresseeInformation = function(dbPath, next){
  return fireMethods.dbConnect(dbPath).once('value')
  .then(function(snapshot){
    var distributionGroup = snapshot.val();
    return fireMethods.dbConnect('attendees')
    .once('value')
    .then(function(attendeeSnap){
      var attendees = attendeeSnap.val();
      var toReturn = {};
      for(var user in distributionGroup){
        toReturn[user] = attendees[user];
      }
      return toReturn;
    })
  })
  .catch(next);
}

routeHelpers.dispatchGroup = function(addressee, emailObj){

}

routeHelpers.compileGroupUsers = function(addresseeObj, emailObj){
  var toDispatch = Object.keys(addresseeObj);
  return toDispatch.map(function(userId){
    var userDetails = addresseeObj[userId];
    userDetails.uid = userId;
    return userDetails;
  })
}

module.exports = routeHelpers;
