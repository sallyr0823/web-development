var secrets = require('../config/secrets');
var User = require('../models/user.js');
var Tasks = require('../models/tasks.js');
const mongoose = require('mongoose');
const user = require('./user');
mongoose.set('useFindAndModify', false);

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
        updateInfo.pendingTasks = JSON.parse("[" + req.body.pendingTasks+ "]");;
       } else {
        updateInfo.pendingTasks = [];
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
        var userName;
        var newUser = {};
        console.log(updateInfo);
        User.findOneAndUpdate({_id:userId}, {$set:updateInfo}, { new: true}).exec().then(function(userData) {
            console.log(userData);
            if (userData == null) {
                // Create a new user instance and save
                return res.status(404).send({
                    message: 'User with this id not found',
                    data: userData
                });

            } 
            userName = userData.name;
            newUser = userData;
        }).catch(function(err) {
            return res.status(500).send({
                message: 'Error while updating user',
                data: err.toString()
            });
        }); 

        try {
            await Promise.all(updateInfo.pendingTasks.map(newTask => {
                return Tasks.findByIdAndUpdate(newTask, { assignedUser: userId, assigendUserName: userName },{new:true}).exec();
            }));

            return res.status(200).send({
                message: 'Replaced the user with new user',
                data: newUser
            });
        } catch (err) {
            return res.status(500).send({
                message: 'Error while updating tasks',
                data: err.toString()
            });
        }

       
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
                        return Tasks.findByIdAndUpdate(task, { assignedUser: '', assigendUserName: 'unassigned' },{new:true}).exec();
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
                data: err.toString()
            });
        });
        User.findOneAndDelete(userId).exec().then(function(data) {
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