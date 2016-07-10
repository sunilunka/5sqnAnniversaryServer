'use strict';

var mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    type: String
  },

  variants: {
    type: [Schema.Types.ObjectId]
  },
  quantity: {
    type: Number
  },
  price: {
    type: Number
  }

})

mongoose.model('Product', productSchema);
