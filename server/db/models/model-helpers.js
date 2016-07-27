'user strict';

module.exports = {
  updateStock: function(operation, amount){
    var currentStock = this.stock;
    var self = this;
    if(operation === 'add'){
     self.stock += amount;
     return self.save();
   } else if(operation === 'subtract'){
     self.stock -= amount;
     return self.save();
    }
  },

  transformToCents: function(value){
    if(!value) return 0;
    if(typeof value === 'Number'){
      return value;
    }
    return parseFloat(value) * 100;
  },

  transformToString: function(num){
    if(!num) return '00.00';
    return (num / 100).toFixed(2);
  },

  getAvailableStock: function(item_id, requestedStock){
    return this.findById(item_id)
    .select('stock')
    .exec()
    .then(function(item){
      if(requestedStock < item.stock){
        return requestedStock;
      } else {
        return item.stock;
      }
    })
  }
}
