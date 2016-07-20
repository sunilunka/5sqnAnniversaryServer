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
    default: 0
  },

  price: {
    type: Number,
    get: modelHelpers.transformToString,
    set: modelHelpers.transformToCents
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

productSchema.set('toJSON', {
  getters: true
});
productSchema.set('toObject', {
  getters: true
});

productSchema.methods.updateStock = function(operation, amount, cb){
  return modelHelpers.updateStock.call(this, operation, amount, cb);
}

mongoose.model('Product', productSchema);
