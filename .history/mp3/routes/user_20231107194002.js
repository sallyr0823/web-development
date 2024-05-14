var secrets = require('../config/secrets');
var User = require('../models/user.js');
var Tasks = require('../models/tasks.js');

module.exports = function (router) {

    var userRoute = router.route('/users');

    userRoute.get(function (req, res) {
        //console.log(req.query);

        let where ={};
        if(req.query.where) {
            try {
                where = JSON.parse(req.query.where);
                //console.log(where);
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


    userRoute.post(async function (req, res) {
        var newUser = {};
        if(!('name' in req.body)) {
            return res.status(404).send({
                message: 'name not provided',
                data : []
            });

        } else {
            newUser.name = req.body.name;
        }

        if(!('email' in req.body)) {
            return res.status(404).send({
                message: 'email not provided',
                data : []
            });
        } else {
            newUser.email = req.body.email;
        }

        // use return here will simply return from the current function data it
        // it will keep going if later there are modification on res

        // await User.find({email:req.body.email}).exec().then(function(data) {
        //     console.log(data);
        //     if(data.length == 0) {
        //         return res.status(400).send({
        //             message: 'user with same email found',
        //             data : []
        //         });
        //     };
        // }).catch(function(err) {
        //     return res.status(500).send({
        //         message: 'error happens',
        //         data : err.toString()
        //     });
        // });
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
        

        newUser.dateCreated = Date().toString();
        // find pending task by task
        var tasksIdList = [];
        if('pendingTasks' in req.body && Array.isArray(req.body.pendingTasks)) {
            tasksIdList = req.body.pendingTasks;
        } 
        var newTasksList = [];
        var tasksPromises = tasksIdList.map(function(tasksId) {
            return Tasks.findById(tasksId).exec(); // Map each tasksId to a promise
        });
        try{
        Promise.all(tasksPromises).then(function(tasksDataArray) {
            tasksDataArray.forEach(function(tasksData) {
                if(tasksData != null) {
                    newTasksList.push(tasksData.id); // Use 'push' instead of 'push_back'
                }
            });
        })
         }   catch(error) {
            return res.status(500).send({
                message: 'Error happens',
                data: err.toString()
            });
        };
        newUser.pendingTasks = newTasksList || [];


        //console.log(newUser);
        var user= new User(newUser);
        user.save().then(function(data) {

            newTasksList.forEach(function(tasksId) {
                Tasks.findbyId(tasksId).exec().then(function(tasksData) {
                    if (tasksData.assignedUser != '') {
                        var originUser = tasksData.assignedUser;
                        User.findbyId(originUser).exec().then(function(originData) {
                            if (originData != null) {
                                originData.pendingTasks.pull(tasksId);
                                originData.save();
                            };
                        })
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
        
    }); 
    return router;
}

