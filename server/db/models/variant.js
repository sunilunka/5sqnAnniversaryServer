'use strict';

var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var variantSchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId
  },
  options: {
    type: {},
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }

})

mongoose.model('Variant', variantSchema);
