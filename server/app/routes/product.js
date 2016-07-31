'use strict';

var path = require('path');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var Variant = mongoose.model('Variant');
var routeHelpers = require('./product-route-helpers');
var fireMethods = require(path.join(__dirname, '../../db/fire-db'));
var _ = require('lodash');

router.get('/', function(req, res, next){
  Product.find({}).exec()
  .then(function(products){
    res.status(200).json(products);
  })
})

router.post('/new', function(req, res, next){
  fireMethods.checkAuthorisedManager(req.body['user_id'])
  .then(function(authorised){
    if(authorised){
      var variants;
      if(req.body.product.hasOwnProperty('variants')){
        /* If req.body has the property variants, store in variable, then delete the property. This is because the variants are saved in the Variant collection and only their ObjectId are saved to the array. A cast error will result. Variants are populated on request for a specific product page. */
        variants = req.body.product.variants;
        delete req.body.product.variants;
      } else {
        variants = [];
      }
      Product.create(req.body.product)
      .then(function(product){
        if(variants.length){
          var processedVariants = routeHelpers.processVariants(product, variants);
          Variant.create(processedVariants)
          .then(function(savedVariants){
            routeHelpers.addVariantRefToParent(product, savedVariants);
            return product.save();
          })
          .then(function(product){
            res.status(201).json(product);
          })
        } else {
          res.status(201).json(product);
        }
      })
      .catch(next)
    } else {
      res.sendStatus(401);
    }
  })
})

router.param('productId', function(req, res, next, id){
  Product.findById(id)
  .populate('variants')
  .exec()
  .then(function(product){
    req.product = product;
    next();
  })
})

router.get('/:productId', function(req, res, next){
  res.status(200).json(req.product);
})

router.put('/:productId', function(req, res, next){
  fireMethods.checkAuthorisedManager(req.body['user_id'])
  .then(function(authorised){
    if(authorised){
      var updatedVariants = req.body.product.variants;
      delete req.body.product.variants;
      routeHelpers.checkVariantsOnUpdate(req.body.product, updatedVariants)
      .then(function(updatedVariants){
        var newVariantIds = updatedVariants.map(function(variant){
          return variant._id;
        })
        _.assign(req.product, req.body.product);
        /* Need to work on logic for removing an image in total from a product or variant. Can change, but not remove at this time. */
        req.product.variants = newVariantIds;
        req.product.save()
        .then(function(updatedProduct){
          res.status(200).json(updatedProduct);
        })
      })
    } else {
      res.sendStatus(401);
    }
  })
})

router.delete('/:productId', function(req, res, next){
  fireMethods.checkAuthorisedManager(req.body['user_id'])
  .then(function(authorised){
    if(authorised){
      var idToRemove = req.product._id;
      Product.findByIdAndRemove(idToRemove)
      .then(function(result){
        return Variant.remove({ product_id: idToRemove })
      })
      .then(function(variantsRemoved){
        res.status(204).json("The product and all variants have been removed.");
      })
    } else {
      res.sendStatus(401);
    }
  })
})

router.put('/:productId/stock', routeHelpers.processAdminStockUpdate)

router.use('/:productId/variants', require('./variant'));


module.exports = router;
