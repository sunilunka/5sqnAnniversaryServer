'use strict';
var mongoose = require('mongoose');

var Variant = mongoose.model('Variant');

module.exports = {
  processVariants: function(parentProduct, variantArray){
    /* Append product_id field to the variant for storage */
    var toStore = variantArray.map(function(variantObj){
      variantObj['product_id'] = parentProduct['_id'];
      if(!variantObj['price']){
        variantObj.price = parentProduct.price;
      }
      return variantObj;
    })
    return toStore;
  },

  addVariantRefToParent: function(parentProduct, variants){
    variants.forEach(function(variant){
      parentProduct.variants.addToSet(variant._id);
    })
  }
}
