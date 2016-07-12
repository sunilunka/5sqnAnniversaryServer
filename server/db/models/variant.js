'use strict';

var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var modelHelpers = require('./model-helpers')

var variantSchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId
  },
  options: {
    type: {},
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }

})

variantSchema.methods.updateStock = function(operation, amount, cb){
  return modelHelpers.updateStock.call(this, operation, amount, cb)
}

mongoose.model('Variant', variantSchema);
