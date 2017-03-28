/**
 * Created by dunice on 28.03.17.
 */
var express = require('express');
var router = express.Router();
var path = require('path');

var controller = require('../controller/controller');
/*  */
router.get('/', controller.loadTasks);

router.post('/', controller.addTask);

router.patch('/', controller.renameTask);

router.patch('/ch', controller.checkTask);

router.delete('/', controller.deleteTasks);

router.delete('/id', controller.deleteId);


module.exports = router;