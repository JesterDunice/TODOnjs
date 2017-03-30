/**
 * Created by dunice on 28.03.17.
 */
var express = require('express');
var router = express.Router();
var path = require('path');

var Todos = require('../../../db').Todos;


function loadTasks(req, res) {
    Todos.find({}).then((result) => {
      res.send(result)
    });
}

function addTask(req, res) {
  Todos.create({name: req.body.name, done: false},
    function (err, doc) {
      if (err) return res.send(500, {error: err});
      return res.send("succesfully added task");
    }
  );
}

function checkAllTasks(req, res) {
  var doneState = (req.body.done == 'true');
  Todos.update({}, {$set: {done: doneState}}, {multi: true},
    function (err, doc) {
      if (err) return res.send(500, {error: err});
      return res.send("succesfully saved");
    }
  );
}

function updateTask(req, res){

  var UniqueId = req.params.id;
  var checkupArray = {};

  if (req.body.done) checkupArray.done = req.body.done;
  if (req.body.name)  checkupArray.name = req.body.name;


  Todos.findByIdAndUpdate(UniqueId, {$set: checkupArray},
    function (err, doc) {
      if (err) return res.send(500, {error: err});
      return res.send("succesfully updated");
    }
  );
}

function deleteDoneTasks(req, res) {
  Todos.remove({done: true},
    function (err, doc) {
      if (err) return res.send(500, {error: err});
      return res.send("succesfully removed all done tasks");
    }
  );
}

function deleteTaskById(req, res) {
  var UniqueId = req.params.id;
  Todos.remove({_id: UniqueId},
    function (err, doc) {
      if (err) return res.send(500, {error: err});
      return res.send("succesfully remove task");
    }
  );
}

module.exports = {loadTasks, addTask, checkAllTasks, updateTask, deleteDoneTasks, deleteTaskById};
