'use strict';

var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var modelHelpers = require('./model-helpers');

var transformToCents = function(value){
  if(typeof value === 'Number'){
    return value;
  }
  return parseFloat(value) * 100;
}

var transformToString = function(num){
  return (num / 100).toFixed(2);
}

var productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },

  options: {
    type: {}
  },

  variants: [{ type: Schema.Types.ObjectId, ref: 'Variant'}],

  stock: {
    type: Number,
    min: [0, 'No stock available'],
    default: 0
  },

  price: {
    type: Number,
    set: transformToCents
  },
  imageURL: {
    type: String
  },
  imageName: {
    type: String
  },
  deliverable: {
    type: Boolean,
    default: false
  }
})

productSchema.methods.updateStock = function(operation, amount, cb){
  return modelHelpers.updateStock.call(this, operation, amount, cb);
}

mongoose.model('Product', productSchema);
