'use strict';

var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var lineItemSchema = new Schema({

})

var orderSchema = new Schema({
  ref: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  recipient: {
    type: String,
    required: true
  },
  products: {
    type: [lineItemSchema],
    required: true
  },
  lineItemCount: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: String,
    required: true
  },
  paymentType: {
    type: String,
    required: true
    enum: ['cash', 'deposit'],
  },
  paymentState: {
    type: String,
    required: true,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  trackingData: {
    type: String
  },
  address: {
    type: Schema.Types.Mixed
  }
  user_id: {
    type: String
  }
  order_date: {
    type: Date,
    required: true,
    default: Date.now
  }
  updated: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('Order', orderSchema);
