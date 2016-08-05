'use strict';
var mongoose = require('mongoose');

var Product = mongoose.model('Product');
var Variant = mongoose.model('Variant');
var _ = require('lodash');

var noStockResponse = function(res, item){
  var toSend = item.toObject();
  toSend['nostock'] = true;
  toSend['stock'] = 0;
  res.status(200).json(toSend);
}

var updateStockErrorHandler = function(err, req, res, next){
  if(err.errors['stock']){
    if(req.hasOwnProperty('variant')){
      noStockResponse(res, req.variant);
    } else {
      noStockResponse(res, req.product)
    }
  } else {
    next(err);
  }
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
        /* this is the updatedProductVariants argument below */
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
  },

  processAdminStockUpdate: function(req, res, next){
    var product;
    if(req.hasOwnProperty('variant')){
      product = req.variant;
    } else {
      product = req.product;
    }

    if(req.body.operation === 'add'){
      product.updateStock('add', req.body.amount)
      .then(function(updatedProduct){
        res.status(200).json(updatedProduct);
      })
    }

    if(req.body.operation === 'subtract'){
      product.updateStock('subtract', req.body.amount)
      .then(function(result){
        res.status(200).json(result)
      })
      .catch(function(err){
        updateStockErrorHandler(err, req, res, next)
      });
    }
  }
}
