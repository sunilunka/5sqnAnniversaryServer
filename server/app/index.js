'use strict';

var express = require('express');
var routes = require('./routes')
var configuration = require('./configure');

var app = express();

module.exports = app;

/* Applies all configuration objects to the application including middleware (body-parser etc.)*/
configuration(app);

app.use("/api", routes);

app.listen(3000, () => {
  console.log("SERVER IS LISTENING ON PORT 3000")
})
