'use strict';

var mongoose = require('mongoose');

const Schema = mongoose.Schema;

var lineItemSchema = new Schema({
  product_id: {
    type: String,
    required: true
  },
  variant_id: {
    type: String
  },
  title: {
    type: String,
    required: true,
  },
  display_options: {
    type: String
  },
  quantity: {
    type: Number,
    required: true
  },
  subtotal: {
    type: String,
    required: true
  },
  deliverable: {
    type: Boolean
  },
  imageURL: {
    type: String
  },
  options: {
    type: Schema.Types.Mixed
  }
})

var orderSchema = new Schema({
  order_ref: {
    type: String,
    required: true,
    unique: true
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
    required: true,
    enum: ['cash', 'deposit'],
  },
  paymentState: {
    type: String,
    required: true,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['processing', 'packaged', 'dispatched', 'delivered', 'ready', 'collected'],
    default: 'processing'
  },
  trackingData: {
    type: String
  },
  pickUpDetails: {
    type: String
  },
  address: {
    type: Schema.Types.Mixed
  },
  user_id: {
    type: String
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
})


mongoose.model('Order', orderSchema);
