'use strict'

const firebase = require('firebase');

var firebaseRefs = {};

firebaseRefs.dbConnect = function(route){
  if(route){
    return firebase.database.ref(route);
  } else {
    return firebase.database();
  }
}

firebaseRefs.getOneAttendeeRef = function(id){
  return firebaseRefs.dbConnect("attendees/" + id);
}

module.exports = firebaseRefs;
