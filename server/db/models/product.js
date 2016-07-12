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
    type: {}
  },

  variants: [{ type: Schema.Types.ObjectId, ref: 'Variant'}],

  stock: {
    type: Number,
    min: [0, 'No stock available'],
  },

  price: {
    type: Number
  }
})

productSchema.methods.updateStock = function(operation, amount, cb){
  var currentStock = this.stock;
  var stockForRequest = 0;
  if(operation === 'add'){
   this.stock += amount;
   return this.save();
 } else if(operation === 'subtract'){
   if(currentStock - amount < 0){
     stockForRequest = amount + (currentStock - amount);
     return cb(stockForRequest);
   } else {
    this.stock -= amount;
    return this.save()
   }
  }
}

mongoose.model('Product', productSchema);
