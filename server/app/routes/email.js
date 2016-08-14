'use strict';

var path = require('path');

var express = require('express');
var router = express.Router();

var mailer = require(path.join(__dirname, '../email'));


router.post('/group', function(req, res, next){

})

router.post('/register-success', function(req, res, next){

})



module.exports = router;
