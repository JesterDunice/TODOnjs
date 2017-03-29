/**
 * Created by dunice on 28.03.17.
 */
var express = require('express');
var router = express.Router();
var path = require('path');

//var controller = express();

// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/data');
//
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log('-------> mongo working and we connected');
// });

var Todos = require('../../../db').Todos;


function loadTasks(req, res) {
    Todos.find({}).then((result)=>{
      //console.log('result',result);
      res.send(result)
    });
}

function addTask(req, res) {
  Todos.create({name: req.body.name, done: req.body.done}).then((result)=>{
    console.log('result',result);
    res.send(result)
  });
}

function renameTask(req, res) {

}

function checkTask(req, res) {
  var UniqueId = req.params.id;
  var doneState = req.params.done;
    Todos.findByIdAndUpdate(UniqueId, { $set: { done: doneState }})
      .then((result) => {
        console.log('===', result.done);
        res.send(result);
      });
}

function deleteTasks(req, res) {
  Todos.remove({done: true}).then((result) => {
      console.log("delete done tasks!!!!!!!");
      res.send(result)
    }
  );
}

function deleteId(req, res) {
  var UniqueId = req.params.id;
  Todos.remove({_id: UniqueId}).then((result) => {
      console.log("done!!!!!!!");
      res.send(result)
    }
  );
}

module.exports = {loadTasks, addTask, renameTask, checkTask, deleteTasks, deleteId};

//module.exports = controller;