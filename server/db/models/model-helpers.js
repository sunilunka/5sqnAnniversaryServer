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
  }
}
