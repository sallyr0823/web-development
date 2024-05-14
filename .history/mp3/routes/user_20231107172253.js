var secrets = require('../config/secrets');
var User = require('../models/user.js');
var Tasks = require('../models/tasks.js');

module.exports = function (router) {

    var userRoute = router.route('/user');

    userRoute.get(function (req, res) {
        let where ={};
        if(req.query.where) {
            try {
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
        var tasksIdList;
        if('pendingTasks' in req.body) {
            tasksIdList = req.body.pendingTasks;
        } 
        var newTasksList;
        tasksIdList.forEach(function(tasksId) {
            Tasks.findbyId(tasksId).exec().then(function(tasksData) {
            if(tasksData != null) {
                // id found, then add
                newTasksList.push_back(tasksData.id);
            };
        }).catch(function(err) {
            res.status(500).send({
                message: 'Error happens',
                error: err.toString()
            });
        });
    });
        newUser.pendingTasks = newTasksList;


 
        User.save(newUser).then(function(data) {
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

