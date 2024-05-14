var User = require('../models/user.js');
var Tasks = require('../models/user.js');


module.exports = function(router) {
    var tasksRoute = router.route('/tasks');

    tasksRoute.get(function (req, res) {
        let where ={};
        if(req.query.where) {
            try {
                where = JSON.parse(req.query.where);
            } catch(err) {
                return res.status(400).send({
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

        let query = Tasks.find(where).
        sort(sort).
        select(select).
        skip(skip).
        limit(limit);

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
                    message: 'tasks found',
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

    tasksRoute.post(function (req, res) {
        var newTasks = {};
        if('name' in req.body) {
            newTasks.name = req.body.name;
        } else {
            return res.status(400).send({
                message: 'can not retrieve task',
                data : ''
            });
        }
        var des = '';
        if('description' in req.body) {
            des = req.body.description;
        }
        newTasks.description = des;
        if('deadline' in req.body) {
            newTasks.deadline = Date(req.body.deadline);
        } else {
            newTasks.deadline = Date('2300-01-01');
        };

        if('completed' in req.body) {
            newTasks.completed = req.body.completed;
        } else {
            newTasks.completed = true;
        };

        newTasks.dateCreated = req.body.dateCreated;

        var assigned = '';
        if('assignedUser' in req.body) {
            assigned = req.body.assignedUser;
            User.findById(assigned).exec().then(function(userData) {
                if(userData == null) {
                    // user not found
                    newTasks.assignedUser = '';
                    newTasks.assignedUserName = 'undefined';
                    Tasks.save(newTasks).exec().then(function(data) {
                        res.status(200).send({
                        message: 'task is created but assigned to non-existent user',
                        data: data})});

                } else {
                    newTasks.assignedUser = userData.id;
                    newTasks.assignedUserName = userData.name;
                    Tasks.save(newTasks).exec.then(function(data) {
                        
                        res.status(200).send({
                            message: 'task is created',
                            data: data
                        });
                        userData.pendingTasks.push_back(data.id);

                    }).catch(function(error) {
                        return res.status(500).send({
                            message: 'Insert failed',
                            error: err.toString()
                        });
                    }
                    )
                }
            })
        }




        
        
    });

}