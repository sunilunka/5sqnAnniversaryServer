'use strict'

var express = require('express');

var router = express.Router();


router.get('/', function(req, res, next){
  console.log("REQUEST: ", req.headers)
  res.set({
    'Access-Control-Allow-Origin': 'http://localhost:1337'
    // 'Access-Control-Expose-Headers':
  })
  res.status(200).json('SERVER HAS RESPONDED');
})



module.exports = router;
