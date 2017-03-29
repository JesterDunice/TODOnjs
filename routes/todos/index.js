/**
 * Created by dunice on 28.03.17.
 */
var express = require('express');
var router = express.Router();
var path = require('path');

var controller = require('./controller/controller');
/*  */
router.get('/', controller.loadTasks);

router.post('/', controller.addTask);

router.patch('/:id&:done', controller.checkTask);

router.patch('/', controller.renameTask);



router.delete('/', controller.deleteTasks);

router.delete('/:id', controller.deleteId);


module.exports = router;

//
// /todos/3?name=true&surname=4&surname=5
//
//
// req.body = {name:'fsdfsdf'}
//
//
// update = {};
// update.name = req.body.name
//
// // _.omitBy(object,_.isNil)
//
// update({id:3},{done:true})


