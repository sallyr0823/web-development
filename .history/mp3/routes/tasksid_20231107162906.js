var secrets = require('../config/secrets');
var User = require('../models/user.js');
var Tasks = require('../models/user.js');
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
        var name = req.body.name || '';
        var des = req.body.description || '';
        var deadline = req.body.deadline|| '';
        var completed = req.body.completed || false;
        var dateCreated = req.body.dateCreated;
        var assignedUser = req.body.assignedUser|| '';
        var assigendUserName = req.body.assigendUserName||'unassigned';
        var newTasks = {
            name: name,
            description: des,
            deadline: deadline,
            completed:completed,
            dateCreated:dateCreated,
            assignedUser:assignedUser,
            assigendUserName:assigendUserName
        };

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


        User.findById(assignedUser).exec.then(async function(user) {
            if(user == null){
                newTasks.assignedUser = '';
                newTasks.assigendUserName = 'unassigned';
            } else {
                if(!completed) {
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
            Tasks.findByIdAndUpdate(taskId,newTasks).exec().then(function(taskData) {
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