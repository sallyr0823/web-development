var secrets = require('../config/secrets');
var User = require('../models/user.js');
var Tasks = require('../models/user.js');
const tasks = require('./tasks');

module.exports = function(router) {
    var tasksIdRoute = router.route('/tasks/:id');

    tasksIdRoute.get(function(req, res) {
        Tasks.findById(req.param.id).exec().then(function (tasksData) {
            if(tasksData == null) {
                res.status(404).send({
                    message: 'user not found',
                    data: userData
                });
            } else {
                res.status(200).send({
                    message: 'user information found',
                    data:tasksData
                });
            }

        }).catch(function(err) {
            res.status(500).send({
                message: 'error happen',
                data: err.tostring()
            });
        });
    });

    tasksIdRoute.put(function(req,res) {
        var taskId = req.param.id;
        var newTasks = {};
        if('name' in req.body) {
            newTasks.name = req.body.name;
        } else {
            newTasks.name = '';
        }
        if('description' in req.body) {
            newTasks.description = req.body.description;
        } else {
            newTasks.description = '';
        }
        if('deadline' in req.body) {
            newTasks.deadline = Date(req.body.deadline);
        }  else {
            newTasks.deadline  = Date('2300-01-01');
        }
        if('completed' in req.body) {
            newTasks.completed = req.body.completed;
        } else {
            newTasks.completed = false;
        }
        if('dateCreated' in req.body) {
            newTasks.dateCreated = req.body.dateCreated;
        } else {
            newTasks.dateCreated = Date.now;
        }

        User.findById(assignedUser).exec.then(function(user) {
            if(user == null){
                newTasks.assignedUser = '';
                newTasks.assignedUserName = 'undefined';
            }
            if(user != null ){
                if(completed) {
            user.pendingTasks.remove(taskId);
            User.save(user).exec();
                } else {
                    user.pendingTasks.push(taskId);
                    User.save(user).exec();
                }
            } 
            Tasks.findByIdAndUpdate(taskId,newTasks).exec().then(function(taskData) {
                return res.status(200).send({
                    message:'task updated',
                    data : taskData
                });
            });
        }).catch(function (err) {
            return res.status(500).send({
                message: 'error happen',
                data: err.tostring()
            });
        });

    });


    tasksIdRoute.delete(function(req, res) {
        var taskId = req.param.id;
        Tasks.findById(taskId).exec().then(function(data) {
            if(data == null) {
                return res.status(404).send({
                    message: 'user not found',
                    data: []
                });
            };
            if(data.assignedUser != null && data.assignedUser != ''){
                User.findById(data.assignedUser).exec().then(function(user){
                    user.pendingTasks.remove(taskId);
                    User.save(user).exec();
                });
            }
            
        }).catch(function(err) {
            return res.status(500).send({
                message: 'error happen',
                data: []
            });
        });
        Tasks.delete(taskId).exec().then(function(data) {
            return res.status(200).send({
                message: 'successfully delete the user',
                data: data
            });
        }).catch(function(err) {
            return res.status(500).send({
                message: 'error happen',
                data: err.tostring()
            });
        });

    });
}