var secrets = require('../config/secrets');
var User = require('../models/user.js');
var Tasks = require('../models/tasks.js');

module.exports = function (router) {

    var userRoute = router.route('/users');

    userRoute.get(function (req, res) {
        let where ={};
        if(req.query.where) {
            try {
                console.log(where);
                where = JSON.parse(req.query.where);
            } catch(err) {
                return res.status(404).send({
                    message: 'invalid search condition',
                    data: [],
                    error: err.toString()
                });
            }
        } else {
            where = {};
        }

        let sort = req.query.sort;
        let select = req.query.select;
        let skip = parseInt(req.query.skip) || 0;
        let count = req.query.count;
        let limit = parseInt(req.query.limit)||100;

        let query = User.find(where).sort(sort).select(select).skip(skip).limit(limit);

        if(count) {
            query.countDocuments().exec().then(function(data) {
                return res.status(200).send({
                    message: 'count of document sent',
                    data: data
                })
            }).catch(function (err) {
                return res.status(500).send({
                    message: 'error',
                    data: [],
                    error: err.toString()
                });
            });
        } else {
            query.exec().then(function(data) {
                return res.status(200).send({
                    message: 'users found',
                    data: data
                })
            }).catch(function (err) {
                return res.status(500).send({
                    message: 'error',
                    data: [],
                    error: err.toString()
                });
            });
        }
    });


    userRoute.post(function (req, res) {
        var newUser = {};

        console.log(req.params);
        console.log(req.body);
        if(!'name' in req.body) {
            return res.status(404).send({
                message: 'user information not found',
                data : []
            });
        } else {
            newUser.name = req.body.name;
        }

        if(!'email' in req.body) {
            return res.status(404).send({
                message: 'user information not found',
                data : []
            });
        } else {
            newUser.email = req.body.email;
        }

        
        User.find({email:req.body.email}).exec().then(function(data) {
            if(data != null) {
                return res.status(500).send({
                    message: 'user with same email found',
                    data : []
                });
            };
        });

        newUser.dateCreated = Date.now;
        // find pending task by task
        var tasksIdList = [];
        if('pendingTasks' in req.body && Array.isArray(req.body.pendingTasks)) {
            tasksIdList = req.body.pendingTasks;
        } 
        var newTasksList = [];
        var tasksPromises = tasksIdList.map(function(tasksId) {
            return Tasks.findById(tasksId).exec(); // Map each tasksId to a promise
        });
        
        Promise.all(tasksPromises).then(function(tasksDataArray) {
            tasksDataArray.forEach(function(tasksData) {
                if(tasksData != null) {
                    newTasksList.push(tasksData.id); // Use 'push' instead of 'push_back'
                }
            });
        }).catch(function(err) {
            res.status(500).send({
                message: 'Error happens',
                data: err.toString()
            });
        });
        newUser.pendingTasks = newTasksList;


        console.log(newUser);
        User.insertOne(newUser).then(function(data) {
            newTasksList.forEach(function(tasksId) {
                Tasks.findbyId(tasksId).exec().then(function(tasksData) {
                    if (tasksData.assignedUser != '') {
                        var originUser = tasksData.assignedUser;
                        User.findbyId(originUser).exec().then(function(originData) {
                            if (originData != null) {
                                originData.pendingTasks.pull(tasksId);
                                originData.save();
                            };
                        }).catch(function(err) {
                            res.status(500).send({
                                message: 'Insert failed',
                                error: err.toString()
                            });
                        });
                    } else {
                        tasksData.assignedUser = data.id;
                        tasksData.save();
                    }
                });
            });
            return res.status(201).send({
                message: 'Successfully inserted a new user',
                data: data
            });
        }).catch(function(err) {
            return res.status(500).send({
                message: 'Insert failed',
                error: err.toString()
            });
        });
        
    }) 
    return router;
}

