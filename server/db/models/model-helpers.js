'user strict';

module.exports = {
  updateStock: function(operation, amount, cb){
    var currentStock = this.stock;
    var self = this;
    if(operation === 'add'){
     self.stock += amount;
     return self.save();
    } else if(operation === 'subtract'){
      return new Promise(function(resolve, reject){
        if(currentStock - amount < 0){
          resolve({
           nostock: true,
           product: self
          })
        } else {
          self.stock -= amount;
          resolve(self.save())
        }
      })
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
  }
}
