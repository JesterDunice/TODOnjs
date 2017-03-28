/**
 * Created by dunice on 28.03.17.
 */
var express = require('express');
var router = express.Router();
var path = require('path');

//var controller = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/data');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('-------> mongo working and we connected');
});



function loadTasks(req, res) {
  db.tasks.find

}

function addTask(req, res) {

}

function renameTask(req, res) {

}

function checkTask(req, res) {

}

function deleteTasks(req, res) {

}

function deleteId(req, res) {

}

module.exports = {loadTasks, addTask, renameTask, checkTask, deleteTasks, deleteId};

//module.exports = controller;