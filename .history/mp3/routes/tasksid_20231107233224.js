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
                    data: tasksData
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
                data: err.toString()
            });
        });
    });

    tasksIdRoute.put(async function(req,res) {
        
        var taskId = req.params.id;

        var updateInfo = {};
        if(req.body.name) {
            updateInfo.name = req.body.name;
        }
        if(req.body.deadline) {
            updateInfo.deadline = req.body.deadline;
        }
        if(req.body.description) {
            updateInfo.description = req.body.description;
        }
        if(req.body.completed) {
            updateInfo.completed = JSON.parse(req.body.completed);
        }
        if(req.body.dateCreated) {
            updateInfo.dateCreated = req.body.dateCreated;
        }
        if(req.body.assignedUser) {
            updateInfo.assignedUser = req.body.assignedUser;
        }
        if(req.body.assignedUserName) {
            updateInfo.assignedUserName = req.body.assignedUserName;
        }

        try {
            var oriTask = await Tasks.findById(taskId).exec();
            
            if(oriTask == null) {
                return res.status(404).send({
                    message: 'no task matching this id',
                    data: oriTask
                });
            }
            
            var oriUser = await User.findById(oriTask.assignedUser).exec();
            console.log(oriUser);
            if(oriUser.pendingTasks.includes(taskId)) {
                oriUser.pendingTasks.pull(taskId);
                await oriUser.save();
            } 
        } catch (err) {
            return res.status(500).send({
                message: 'error happen 1 ',
                data: err.toString()
            });
        }


        
        //console.log(updateInfo);
// Assuming this code is inside an async function
        if (updateInfo.assignedUserName) {
            try {
                const user = await User.findOne({ "name": updateInfo.assignedUserName }).exec();

                if (!user) {
                    updateInfo.assignedUser = null;
                    updateInfo.assignedUserName = 'unassigned';
                } else {
                    if (updateInfo.completed === false) {
                        if (!user.pendingTasks.includes(taskId)) {
                            user.pendingTasks.push(taskId);
                            const savedUser = await user.save();
                            console.log(savedUser);
                        }
                    } else if (updateInfo.completed === true) {
                        if (user.pendingTasks.includes(taskId)) {
                            user.pendingTasks.pull(taskId);
                            const savedUser = await user.save();
                            console.log(savedUser);
                        }
                    }
                }
            } catch (error) {
                return res.status(500).send({
                    message: 'Error happen when finding new assigned user',
                    data: error.toString()
                });
            }
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
    });


    tasksIdRoute.delete(async function(req, res) {
        var taskId = req.params.id;
        try {
            var delTask = await Tasks.findByIdAndDelete(taskId).exec();
            if(delTask == null) {
                return res.status(404).send({
                    message: 'task not found',
                    data: []
                });
            }

            if(delTask.assignedUser != null && delTask.assignedUserName != 'unassigned'){
                var user = await User.findById(delTask.assignedUser).exec();
                console.log(user);
                user.pendingTasks.pull(taskId);
                await user.save();
                
            }

            return res.status(200).send({
                message: 'successfully delete the task',
                data: delTask
            });

        } catch(err) {
            return res.status(500).send({
                message: 'error happen when deleting task',
                data: err.toString()
            });
        }



    });
    return router;
}