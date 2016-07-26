'use strict';
var mongoose = require('mongoose');

var fireMethods = require(path.join(__dirname, '../../db/fire-db'));
var Order = mongoose.model('Variant');
var _ = require('lodash');

module.exports = {
  removeIdFields: function(targetArray){
    return targetArray.map(function(item){
      if(item.hasOwnProperty('_id')){
        delete item._id
      }
      return item;
    })
  }
}
