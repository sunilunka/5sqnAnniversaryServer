'use strict'

const firebase = require('firebase');

var attendeeGuestObj = function(dbObj){

  var self = this;

  this.attendeeObj = dbObj;

  this.generateGuestArray = function(){
    var guestArray = [];
    for(var field in self.attendeeObj){
      if((field !== 'registeredAttendee')){
        guestArray.push(self.attendeeObj[field]);
      }
    }
    self.guests = guestArray;
    return self;
  }

  this.setRegisteredAttendee = function(){
    self.registeredAttendee = self.attendeeObj.registeredAttendee;
    return self;
  }

  this.setUserId = function(userId){
    self.uid = userId;
    return self;
  }

  this.setAttendeePaid = function(eventId){
    if(!self['uid']) return;
    return firebaseRefs.attendeeEventPaymentState(self.uid, eventId)
    .then(function(userPaid){
      userPaid ? (self.paid = true) : (self.paid = false);
      return self;
    })
  }

  this.setTotalAttending = function(){
    if(self.hasOwnProperty('guests')){
      self.totalGuests = (1 + self.guests.length);
      return self;
    } else {
      self.totalGuests = 1;
      return self;
    }
  }
}

// attendeeGuestObj.prototype.generateGuestArray = function(){
//   var guestArray = [];
//   for(var field in this.attendeeObj){
//     if((field !== 'registeredAttendee')){
//       guestArray.push(this.attendeeObj[field]);
//     }
//   }
//   this.guests = guestArray;
//   return this;
// }
//
// attendeeGuestObj.prototype.setregisteredAttendee = function(){
//   this.registeredAttendee = this.attendeeObj.registeredAttendee;
//   return this;
// }
//
// attendeeGuestObj.prototype.setUserId = function(userId){
//   this.uid = userId;
//   return this;
// }


var guestListObjToArray = function(guestListObj, eventId){
  var guestListArray = [];
  for(var attendeeId in guestListObj){
    var arrayObj = new attendeeGuestObj(guestListObj[attendeeId]);
    guestListArray.push(arrayObj.generateGuestArray()
    .setRegisteredAttendee()
    .setUserId(attendeeId)
    .setTotalAttending()
    .setAttendeePaid(eventId)
    .then(function(moddedObj){
      return moddedObj;
    }));

  }
  return Promise.all(guestListArray);
}

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

firebaseRefs.getEventGuests = function(eventId){
  return firebaseRefs.dbConnect('/eventGuests/' + eventId)
  .once('value')
  .then(function(snapshot){
    return snapshot.val();
  })
  .then(function(guestListObj){
    return guestListObjToArray(guestListObj, eventId);
  })
}

firebaseRefs.attendeeEventPaymentState = function(userId, evtId){
  return firebaseRefs.dbConnect('/attendees/' + userId + '/eventPayments/' + evtId)
  .once('value')
  .then(function(snapshot){
    return snapshot.val() ? true : false;
  })
}

module.exports = firebaseRefs;
