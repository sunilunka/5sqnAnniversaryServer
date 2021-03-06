'use strict';

var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var modelHelpers = require('./model-helpers')

var variantSchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  options: {
    type: {},
    required: true
  },
  deliverable: {
    type: Boolean,
    required: true,
    default: false
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'No stock available'],
    default: 0
  },
  price: {
    type: Number,
    required: true,
    get: modelHelpers.transformToString,
    set: modelHelpers.transformToCents
  },
  imageURL: {
    type: String
  },

  imageName: {
    type: String
  }

})

variantSchema.set('toJSON', {
  getters: true
});

variantSchema.set('toObject', {
  getters: true
});

variantSchema.statics.checkStockAvailable = function(item_id, requestedStock){
  return modelHelpers.getAvailableStock.call(this, item_id, requestedStock);
}

variantSchema.methods.updateStock = function(operation, amount){
  return modelHelpers.updateStock.call(this, operation, amount)
}

mongoose.model('Variant', variantSchema);
