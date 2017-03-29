var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('-------> mongo working and we connected');
});



var Todos = mongoose.model('Todos', require('./models/todo.model.js')(mongoose));



//console.log('123123123123123',Kitten);

module.exports = {Todos:Todos};