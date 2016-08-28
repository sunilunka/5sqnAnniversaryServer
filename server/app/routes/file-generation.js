'use strict';

var path = require('path');

var express = require('express');
var router = express.Router();
var fireMethods = require(path.join(__dirname, '../../db/fire-db'));

router.get('/generated-files/guest-list/:eventId', function(req, res, next){
  
})



module.exports = router;
