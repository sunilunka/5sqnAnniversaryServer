'use strict';
var firebase = require('firebase');
var path = require('path')

module.exports = function() {
  firebase.initializeApp({
    serviceAccount: path.join(__dirname + '/5sqnrnzaf-b7d7f8b7e166.json'),
    databaseURL: 'https://5sqnrnzaf.firebaseio.com'
  })
}
