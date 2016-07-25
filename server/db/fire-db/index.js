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
    var userId;
    if(result){
      console.log("RESULT: ", result);
      userId = Object.keys(result)[0];
      return userId;
    } else {
      return null;
    }
  });
}

module.exports = firebaseRefs;
