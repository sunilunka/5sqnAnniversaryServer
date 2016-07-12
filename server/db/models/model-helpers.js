'user strict';

module.exports = {
  updateStock: function(operation, amount, cb){
    var currentStock = this.stock;
    if(operation === 'add'){
     this.stock += amount;
     return this.save();
    } else if(operation === 'subtract'){
     if(currentStock - amount < 0){
       return cb(currentStock);
     } else {
      this.stock -= amount;
      return this.save()
     }
    }
  }
}
