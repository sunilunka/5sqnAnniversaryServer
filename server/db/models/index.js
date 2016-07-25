/* Require  models -- these should register the model into mongoose
so the rest of the application can simply call mongoose.model('<ModelName>')
anywhere the model needs to be used. */
require('./product');
require('./variant');
require('./order');
