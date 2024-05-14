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

 
        Tasks.findById(taskId).exec().then(function(oriTask) {
            if(oriTask == null) {
                return res.status(404).send({
                    message: 'no task matching this id',
                    data: oriTask
                });
            }
            User.findById(oriTask.assignedUser).exec().then(async function(oriUser) {
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
                data: err.toString()
            });
        });

        
        console.log(updateInfo);
        if(updateInfo.assignedUserName) {
        User.findOne({"name":updateInfo.assignedUserName}).exec().then(function(user) {
            console.log(user);
            if(user == null){
                updateInfo.assignedUser = null;
                updateInfo.assignedUserName = 'unassigned';
            } else {
                


                if(updateInfo.completed == false) {


                    console.log("here");
                    user.pendingTasks.push(taskId);
                    console.log(user);
                    user.save(function(err,result){ 
                        if (err){ 
                            console.log(err); 
                        } 
                        else{ 
                            console.log(result) 
                        }});
   
                }else if(updateInfo.completed = true) {
                    try{
                        user.pendingTasks.pull(taskId);
                        user.save();
                    } catch(err) {
                        return res.status(500).send({
                            message: 'error happen when finding new assigned user',
                            data: err.toString()
                        });
                    };
                }
        }}).catch(function (err) {
            return res.status(500).send({
                message: 'error happen when finding new assigned user',
                data: err.toString()
            });
        });
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


    tasksIdRoute.delete(function(req, res) {
        var taskId = req.params.id;
        Tasks.findByIdAndDelete(taskId).exec().then(async function(data) {
            if(data == null) {
                return res.status(404).send({
                    message: 'user not found',
                    data: []
                });
            };
            if(data.assignedUser != null && data.assignedUserName != 'unassigned'){
                try {
                    var user = await User.findById(data.assignedUser);
                    user.pendingTasks.pull(taskId);
                    await user.save();
                } catch(error) {
                    res.status(500).send({
                        message: 'error happen',
                        data: error.toString()
                    });
                }
            }
            return res.status(200).send({
                message: 'successfully delete the user',
                data: data
            });
            
        }).catch(function(err) {
            return res.status(500).send({
                message: 'error happen when deleting task',
                data: err.toString()
            });
        });



    });
    return router;
}