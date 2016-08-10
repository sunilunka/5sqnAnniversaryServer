'use strict';

var mongoose = require('mongoose');

const Schema = mongoose.Schema;

var lineItemSchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  variant_id: {
    type: Schema.Types.ObjectId,
    ref: 'Variant'
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
  shippingPrice: {
    type: String
  },

  totalPrice: {
    type: String,
    required: true
  },
  paymentMethod: {
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
    enum: ['received', 'dispatched', 'collected', 'cancelled'],
    default: 'received'
  },
  trackingData: {
    type: String
  },
  deliveryMethod: {
    type: String,
    enum: ["Pick Up", "Post/Courier"]
  },
  address: {
    type: Schema.Types.Mixed
  },
  user_id: {
    type: String
  }
},
{
  timestamps: true
})


mongoose.model('Order', orderSchema);
