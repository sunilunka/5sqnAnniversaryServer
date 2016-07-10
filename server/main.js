'use strict';
var path = require('path');
var chalk = require('chalk');

var startDb = require(path.join(__dirname, './db'));

var server = require('http').createServer();

var createApp = function(){
  var app = require('./app');
  /* Append express to the application*/
  server.on('request', app);
}

var startServer = function () {
    var PORT = process.env.PORT || 3000;
    server.listen(PORT, function () {
        console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));
    });

};

startDb.then(createApp).then(startServer)
.catch(function(err){
    console.error(chalk.red(err.stack));
    process.kill(1);
});
