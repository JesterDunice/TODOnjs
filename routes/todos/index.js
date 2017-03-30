/**
 * Created by dunice on 28.03.17.
 */
var express = require('express');
var router = express.Router();

var controller = require('./controller/controller');
/*  */
router.get('/', controller.loadTasks);

router.post('/', controller.addTask);

router.patch('/:id',controller.updateTask);

router.patch('/', controller.checkAllTasks);

router.delete('/done', controller.deleteDoneTasks);

router.delete('/:id', controller.deleteTaskById);


module.exports = router;



