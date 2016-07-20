'use strict';
var mongoose = require('mongoose');

var Variant = mongoose.model('Variant');
var _ = require('lodash');

var convertPriceToString = function(num){
  console.log("CALLED WITH NUMBER: ", num, typeof (num / 100).toFixed(2));
  return (num / 100).toFixed(2);
}

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
  },

  checkVariantsOnUpdate: function(parentProduct, newVariants){
    return Variant.find({ product_id: parentProduct._id })
    .exec()
    .then(function(oldVariants){
      var toRemove = [];
      oldVariants.forEach(function(variant){
        if(_.findIndex(newVariants, ['_id', variant._id.toString()]) === -1){
          toRemove.push(variant.remove())
        }
      })
      if(toRemove.length){
        return Promise.all(toRemove)
        .then(function(removedVariants){
          return Variant.find({ product_id: parentProduct._id }).exec()
        })
      } else {
        return oldVariants;
      }
    })
    .then(function(updatedProductVariants){
      var variantsToSave = updatedProductVariants.map(function(variant){
        var variantUpdateIndex = _.findIndex(newVariants, function(v){
          return v._id === variant._id.toString();
        });
        if(variantUpdateIndex > -1){
          _.assign(variant, newVariants[variantUpdateIndex]);
          newVariants.splice(variantUpdateIndex, 1);
          return variant.save()
        }
      })

      if(newVariants){
        newVariants.forEach(function(unsavedVariant){
          variantsToSave.push(Variant.create(unsavedVariant));
        })
      }
      return Promise.all(variantsToSave);
    })
  }
}
