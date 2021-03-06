'use strict';
var path = require('path');
var chalk = require('chalk');
var firebaseInit = require(path.join(__dirname, '../app/configure/authentication/firebase_config'));

var DATABASE_URI = require(path.join(__dirname, '../env')).DATABASE_URI;

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


var db = mongoose.connect(DATABASE_URI).connection;

/* Require our models -- these should register the model into mongoose so the rest of the application can simply call mongoose.model('<modelName>') anywhere the required model needs to be used. */
require('./models');

var startDbPromise = new Promise(function (resolve, reject) {
    db.on('open', resolve);
    db.on('error', reject);
});

console.log(chalk.yellow('Opening connection to MongoDB . . .'));
startDbPromise.then(function (db) {
    /* Initiate the Firebase App to allow Firebase DB connections */
    firebaseInit();
    console.log(chalk.green('MongoDB connection opened!'));
});

module.exports = startDbPromise;
