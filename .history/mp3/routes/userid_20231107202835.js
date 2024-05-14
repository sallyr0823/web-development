var secrets = require('../config/secrets');
var User = require('../models/user.js');
var Tasks = require('../models/tasks.js');
const mongoose = require('mongoose');

module.exports = function(router) {
    var userIdRoute = router.route('/users/:id');


    // get request

    userIdRoute.get(function(req, res) {

        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).send({
                message: 'user not found,id is invalid',
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


    userIdRoute.put(async function(req, res) {
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

        try {
            var oriData = await User.findById(userId);
            await Tasks.updateMany(
                {"_id": {$in:oriData.pendingTasks}},
            {$set:{"assignedUser":null,"assignedUserName":"unassigned"}}
            );
        } catch(error) {
            return res.status(500).send({
                message: 'error happen when updating tasks',
                data :error.toString()
            });
        }

        User.findByIdAndUpdate(userId, newUser, { new: true }).exec().then(async function(userData) {

            if (userData == null) {
                // Create a new user instance and save
                return res.status(404).send({
                    message: 'User with this id not found',
                    data: userData
                });
            } else {
                try {
                    console.log(userData.pendingTasks);
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