var secrets = require('../config/secrets');
var User = require('../models/user.js');
var Tasks = require('../models/tasks.js');
const mongoose = require('mongoose');
const user = require('./user');

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
        var updateInfo = {};
        var userId = req.params.id;
        if(req.body.name) {
            updateInfo.name = req.body.name;
            try {
                const data = await User.findOne({ name: req.body.name }).exec();
                console.log(data);
            
                if (data) {
                    return res.status(400).send({
                        message: 'User with the same email already exists.',
                        data: []
                    });
                }
    
            } catch (err) {
                return res.status(500).send({
                    message: 'An error occurred during the query.',
                    data: err.toString()
                });
            }
        }
        if(req.body.email) {
            updateInfo.email = req.body.email;
            try {
                const data = await User.findOne({ email: req.body.email }).exec();
                console.log(data);
            
                if (data) {
                    return res.status(400).send({
                        message: 'User with the same email already exists.',
                        data: []
                    });
                }
    
            } catch (err) {
                return res.status(500).send({
                    message: 'An error occurred during the query.',
                    data: err.toString()
                });
            }
        }

       if(req.body.pendingTasks) {
        updateInfo.pendingTasks = req.body.pendingTasks;
       }
        if(req.body.createdDate) {
            updateInfo.createdDate =  req.body.createdDate;
        }
 
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
        console.log(updateInfo);
            
        User.findByIdAndUpdate(userId, updateInfo).exec().then(async function(userData) {
            console.log(userId);
            console.log(userData);
            if (userData == null) {
                // Create a new user instance and save
                return res.status(404).send({
                    message: 'User with this id not found',
                    data: userData
                });

            } else {
                if(updateInfo.pendingTasks) {
                    updateInfo.pendingTasks.forEach(function(newTask) {
                        Tasks.findById(newTask, {$set : {assignedUser:userId,assignedUserName:userData.name}}).exec().catch(function(err) {
                            return res.status(500).send({
                                message: 'Error while updating tasks',
                                data: err.toString()
                            });
                        });
                    });
                }
                return res.status(200).send({
                    message: 'Successfully update user info',
                    data: userData
                });
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