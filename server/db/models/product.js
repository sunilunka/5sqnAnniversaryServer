'use strict';

var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var modelHelpers = require('./model-helpers');

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
  },

  price: {
    type: Number
  },
  imageURL: {
    type: String
  },
  imageName: {
    type: String
  }
})

productSchema.methods.updateStock = function(operation, amount, cb){
  return modelHelpers.updateStock.call(this, operation, amount, cb);
}

mongoose.model('Product', productSchema);
