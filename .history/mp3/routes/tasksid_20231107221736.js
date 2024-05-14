var secrets = require('../config/secrets');
var User = require('../models/user.js');
var Tasks = require('../models/tasks.js');
module.exports = function(router) {
    var tasksIdRoute = router.route('/tasks/:id');

    tasksIdRoute.get(function(req, res) {
        Tasks.findById(req.params.id).exec().then(function (tasksData) {
            if(tasksData == null) {
                res.status(404).send({
                    message: 'task not found',
                    data: userData
                });
            } else {
                res.status(200).send({
                    message: 'task information found',
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
        
        var taskId = req.params.id;

        var updateInfo = {};
        if(req.body.name) {
            updateInfo.name = req.body.name;
        }
        if(req.body.deadline) {
            updateInfo.deadline = req.body.deadline;
        }
        if(req.body.description) {
            updateInfo.completed = req.body.completed;
        }
        if(req.body.dateCreated) {
            updateInfo.dateCreated = req.body.dateCreated;
        }
        if(req.body.assignedUser) {
            updateInfo.assignedUser = req.body.assignedUser;
        }
        if(req.body.assigendUserName) {
            updateInfo.assignedUserName = req.body.assignedUserName;
        }

 
        Tasks.findById(taskId).exec.then(function(oriTask) {
            if(oriTask == null) {
                return res.status(404).send({
                    message: 'no task matching this id',
                    data: oriTask
                });
            }
            User.findById(oriTask.assignedUser).exec.then(async function(oriUser) {
                try{
                    oriUser.pendingTasks.pull(taskId);
                    await oriUser.save();
                } catch(err) {
                    return res.status(500).send({
                        message: 'error happen',
                        data: err.toString()
                    });
                };
                
            });
        }).catch(function(err) {
            res.status(500).send({
                message: 'error happen',
                data: err.tostring()
            });
        });

        if(updateInfo.assignedUserName) {
        User.findOne({"assignedUserName":updateInfo.assignedUserName}).exec.then(async function(user) {
            if(user == null){
                newTasks.assignedUser = null;
                newTasks.assigendUserName = 'unassigned';
            } else {
                if(updateInfo.completed == false) {
                    try{
                        user.pendingTasks.push(taskId);
                        await user.save();
                    } catch(err) {
                        return res.status(500).send({
                            message: 'error happen',
                            data: err.toString()
                        });
                    };
                }
            Tasks.findOneAndUpdate({_id:taskId}, {$set:updateInfo}, {new: true}).exec().then(function(taskData) {
                return res.status(200).send({
                    message:'task updated',
                    data : taskData
                });
            }).catch(function (err) {
                return res.status(500).send({
                    message: 'error happen',
                    data: err.toString()
                })});

        }}).catch(function (err) {
            return res.status(500).send({
                message: 'error happen',
                data: err.toString()
            });
        });
    }

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
            if(data.assignedUser != '' && data.assignedUserName != 'unassigned'){
                User.findById(data.assignedUser).exec().then(async function(user){
                    try{
                        user.pendingTasks.pull(taskId);
                        await user.save();
                    }catch(err) {
                        res.status(500).send({
                            message: 'error happen',
                            data: err.toString()
                        });
                    };
                    
                });
            }
            
        }).catch(function(err) {
            return res.status(500).send({
                message: 'error happen',
                data: err.toString()
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
                data: err.toString()
            });
        });

    });
    return router;
}