var secrets = require('../config/secrets');
var User = require('../models/user.js');

module.exports = function (router) {

    var userRoute = router.route('/user');

    userRoute.get(function (req, res) {
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

        let query = User.find(where).
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
        if ('name' in req.body) {
            newUser.name = req.body.name;
        } else {
            return res.status(400).send({
                message: 'user information not found',
                data : data
            });
        }
        if('email' in req.body) {
            newUser.email = req.body.email;
        } else {
            newUser.email = ' ';
        }
        newUser.dateCreated = Date.now;
        // find pending task by task
        var tasksIdList;
        if('pendingTasks' in req.body) {
            req.body.pendingTasks.forEach(function(id) {
                tasksIdList.push_back(Tasks.findbyId(id).exec());
            });
        }
        var newTasksList;
        // add user for each task (don't know what to do yet)
        tasksIdList.forEach(function(tasksId) {
            Tasks.findbyId(tasksId).exec().then(function(tasksData) {
            if(tasksData != null) {
                // id found, then add
                newTasksList.push_back(tasksData.id);
            };
        })
    });
        newUser.pendingTasks = newTasksList;


 
        User.save(newUser).then(function(data) {

            return res.status(200).send({
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

