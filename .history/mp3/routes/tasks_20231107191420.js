var User = require('../models/user.js');
var Tasks = require('../models/tasks.js');


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

        let query = Tasks.find(where).sort(sort).select(select).skip(skip).limit(limit);

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
        console.log(req);
        if(!('name' in req.body)) {
            return res.status(404).send({
                message: 'can not create task with no name',
                data : ''
            });
        } else {
            newTasks.name = req.body.name;
        }

        if(!('deadline' in req.body)) {
            return res.status(404).send({
                message: 'can not create task with no deadline',
                data : ''
            });
        } else {
            newTasks.deadline = Date.parse(req.body.deadline);
        }
        var des = req.body.description || '';
        var completed = req.body.completed || false;
        var dateCreated = req.body.dateCreated;

        newTasks.description = des;
        newTasks.dateCreated = dateCreated;
        newTasks.completed = completed;
        var assigned = req.body.assignedUser|| '';
        User.findById(assigned).exec().then(function(userData) {
            if(userData == null) {
                // user not found
                newTasks.assignedUser = '';
                newTasks.assignedUserName = 'unassigned';
                Tasks.save(newTasks).exec().then(function(data) {
                    res.status(201).send({
                    message: 'task is created but assigned to non-existent user',
                    data: data})});

            } else {
                newTasks.assignedUser = userData.id;
                newTasks.assignedUserName = userData.name;
                Tasks.save(newTasks).exec.then(function(data) {
                    
                    res.status(201).send({
                        message: 'task is created',
                        data: data
                    });
                    userData.pendingTasks.push(data.id);
                    userData.save();

                }).catch(function(err) {
                    return res.status(500).send({
                        message: 'Insert failed',
                        error: err.toString()
                    });
                }
                )
            }
        }); 
    });

    return router;

}