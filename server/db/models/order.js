'use strict';

var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var orderSchema = new Schema({
  ref: {
    type: String,
    required: true
  },
  updated: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('Order', orderSchema);
