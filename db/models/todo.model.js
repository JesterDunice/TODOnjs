


module.exports = function(mongoose) {
    return mongoose.Schema({
      name: String,
      done: Boolean,
      id:   String,
    });
};