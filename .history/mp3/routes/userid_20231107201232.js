var secrets = require('../config/secrets');
var User = require('../models/user.js');
var Tasks = require('../models/tasks.js');
const mongoose = require('mongoose');

module.exports = function(router) {
    var userIdRoute = router.route('/users/:id');


    // get request

    userIdRoute.get(function(req, res) {
        console.log(req.params);

        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).send({
                message: 'user not found',
                data: []
            });
        }
        User.findById(req.params.id).exec().then(function (userData) {
            if(userData == null) {
                return res.status(404).send({
                    message: 'user not found',
                    data: userData
                });
            } else {
                return res.status(200).send({
                    message: 'user information found',
                    data:userData
                });
            }

        }).catch(function(err) {
            return res.status(500).send({
                message: 'error happen',
                data: err.toString()
            });
        });
    });


    userIdRoute.put(function(req, res) {
        var userId = req.params.id;
        var name = req.body.name || '';
        var email = req.body.email || '';
        var pendingTasks = req.body.pendingTasks || [];
        var createdDate = req.body.createdDate;
        var newUser = {
            name: name,
            email: email,
            pendingTasks: pendingTasks,
            createdDate: createdDate
        };

        // update on original task list
        User.findById(userId).exec().then(function(oriData) {
            oriData.pendingTasks.forEach(function(oriTask) {
                Tasks.updateMany(oriTask,{assignedUser:'',
            assigendUserName: 'unassigned'}).exec().catch(function(err) {
                return res.status(500).send({
                    massage: 'fail to update task',
                    data: err.toString()
                });
            });
            });
        }).catch(function(err) {
            return res.status(500).send({
                message: 'error happen',
                data :err.toString()
            });
        });


        User.findByIdAndUpdate(userId, newUser, { new: true }).exec().then(async function(userData) {
            if (userData == null) {
                // Create a new user instance and save
                return res.status(404).send({
                    message: 'User with this id not found',
                    data: userData
                });
            } else {
                try {
                    // Use Promise.all to update all tasks and wait for them to complete
                    await Promise.all(newUser.pendingTasks.map(newTask => {
                        return Tasks.findByIdAndUpdate(newTask, { assignedUser: userId, assigendUserName: newUser.name }).exec();
                    }));
        
                    return res.status(200).send({
                        message: 'Replaced the user with new user',
                        data: userData
                    });
                } catch (err) {
                    return res.status(500).send({
                        message: 'Error while updating tasks',
                        data: err.toString()
                    });
                }
            }
        }).catch(function(err) {
            return res.status(500).send({
                message: 'Error while updating user',
                data: err.toString()
            });
        });        
    });

    userIdRoute.delete(function(req, res) {
        var userId = req.param.id;
        User.findById(userId).exec().then(async function(data) {
            if(data == null) {
                return res.status(404).send({
                    message: 'user not found',
                    data: []
                });
            };
            if(data.pendingTasks != null){
                try{
                    await Promise.all(data.pendingTasks.map(task => {
                        return Tasks.findByIdAndUpdate(newTask, { assignedUser: '', assigendUserName: 'unassigned' }).exec();
                }));
                } catch(err) {
                    return res.status(500).send({
                        message: 'Error while updating tasks',
                        data: err.toString()
                    });
                }
            }
        }).catch(function(err) {
            return res.status(500).send({
                message: 'error happen',
                data: []
            });
        });
        User.delete(userId).exec().then(function(data) {
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