'use strict'

const firebase = require('firebase');

var firebaseRefs = {};

firebaseRefs.dbConnect = function(route){
  if(route){
    return firebase.database().ref(route);
  } else {
    return firebase.database();
  }
}

firebaseRefs.getOneAttendeeRef = function(id){
  return firebaseRefs.dbConnect("attendees/" + id)
  .once('value')
  .then(function(snapshot){
    return snapshot.val();
  })
}

firebaseRefs.checkAuthorisedManager = function(id){
  return firebaseRefs.dbConnect("managers/" + id)
  .once('value')
  .then(function(snapshot){
    if(snapshot.val()){
      return firebaseRefs.getOneAttendeeRef(id)
      .then(function(attendeeData){
        if(attendeeData['manager']){
          return true;
        }
      })
    } else {
      return false;
    }
  })
}

firebaseRefs.getEmailAssociatedUser = function(emailAddress){
  return firebaseRefs.dbConnect('attendees').orderByChild('email').equalTo(emailAddress).once('value')
  .then(function(childSnap){
    var result = childSnap.val();
    var userObj;
    if(result){
      var user_id = Object.keys(result)[0];
      userObj = result[user_id];
      userObj['user_id'] = user_id;
      return userObj;
    } else {
      return null;
    }
  });
}

firebaseRefs.generateOrderRefNumber = function(){
  return firebaseRefs.dbConnect('/orderRef').transaction(function(currentData){
    if(currentData === null){
      return 5000;
    } else {
      return currentData + 1;
    }
  })
  .then(function(transactionObj){
    return transactionObj.snapshot.val();
  })
}

module.exports = firebaseRefs;
