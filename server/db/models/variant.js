'use strict';

var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var variantSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId
  },
  options: {
    type: String
  },
  quantity: {
    type: Number
  },
  price: {
    type: Number
  }

})

mongoose.model('Variant', variantSchema);
