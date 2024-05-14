var secrets = require('../config/secrets');
var User = require('../models/user.js');
var Tasks = require('../models/user.js');

module.exports = function(router) {
    var userIdRoute = router.route('/user/:id');


    // get request

    userIdRoute.get(function(req, res) {
        User.findById(req.param.id).exec().then(function (userData) {
            if(userData == null) {
                res.status(404).send({
                    message: 'user not found',
                    data: userData
                });
            } else {
                res.status(200).send({
                    message: 'user information found',
                    data:userData
                });
            }

        }).catch(function(err) {
            res.status(500).send({
                message: 'error happen',
                data: err.tostring()
            });
        });
    });


    userIdRoute.put(function(req, res) {
        var userId = req.param.id;
        var name = '';
        var email = '';
        var pendingTasks= [];
        var createdDate;
        if('name' in req.body) {
            name = req.body.name;
        }
        if('email' in req.body) {
            email = req.body.email;
        }
        if('pendingTasks' in req.body) {
            pendingTasks = req.body.pendingTasks;
        }
        if('createdDate' in req.body) {
            createdDate = req.body.createdDate;
        } else {
            createdDate = Date.now;
        }
        var newUser = {
            name: name,
            email: email,
            pendingTasks: pendingTasks,
            createdDate: createdDate
        };

        // update on original task list
        User.findById(userId).exec().then(function(oriData) {
            oriData.pendingTasks.forEach(function(oriTask) {
                Tasks.findByIdAndUpdate(oriTask,{assignedUser:'',
            assigendUserName: 'undefined'});
            });
        }).catch(function(err) {
            return res.status(500).send({
                message: 'error happen',
                data :err.tostring()
            });
        });


        User.findByIdAndUpdate(userId,newUser).exec().then(function(userData) {
            if(userData == null) {
                User.save(newUser).exec.then(function(data) {
                    return res.status(200).send({
                        message: 'not find the user, create one',
                        data : data
                    });
                });
            } else {
                newUser.pendingTasks.forEach(function(newTask) {
                    Tasks.findByIdAndUpdate(newTask,{assignedUser:userId,
                    assigendUserName: newUser.name});
                });
                return res.status(200).send({
                    message: 'replace the user with new user',
                    data: userData
                });

            };
        }).catch(function(err) {
            return res.status(500).send({
                message: 'error happen',
                data :[]
            });
        });
    });

    userIdRoute.delete(function(req, res) {
        var userId = req.param.id;
        User.findById(userId).exec().then(function(data) {
            if(data == null) {
                return res.status(404).send({
                    message: 'user not found',
                    data: []
                });
            };
            if(data.pendingTasks != null){
            data.pendingTasks.forEach(function(taskId) {
                Tasks.findByIdAndUpdate(taskId,{assignedUser:'',
            assigendUserName:'undefined'}).exec();
            });
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
                data: []
            });
        });

    });
}