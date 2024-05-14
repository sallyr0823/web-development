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

    tasksRoute.post(async function (req, res) {
        var newTasks = {};
        //console.log(req);
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
        newTasks.description = req.body.description || '';
        newTasks.completed = req.body.completed || false;
        newTasks.dateCreated = req.body.dateCreated;
        newTasks.assignedUser = req.body.assignedUser || '';
        newTasks.assignedUserName = req.body.assignedUserName || 'unassigned';
        var assigned = newTasks.assignedUserName;

        var userData;
        console.log(assigned);
        if(assigned != 'unassigned') {
        try {
            userData = await User.findOne({"name":assigned}).exec();
            
            //console.log(userData);
            if(userData) {
                newTasks.assignedUser = '';
                newTasks.assignedUserName = 'unassigned';
            } else {
                newTasks.assignedUser = userData.id;
                newTasks.assignedUserName = userData.name;
            }
        } catch (error) {
            return res.status(500).send({
                message: 'Error happens',
                error: error.toString()
            });
        }
       }
    var newT = new Tasks(newTasks);
    //console.log(userData);
    
    newT.save().then(async function(savedTask) {
        var msg = (newTasks.assignedUserName === "unassigned") 
                  ? "Task is created but not assigned" 
                  : "Task is created";
    
        if (userData) {
            try {
                console.log(userData);
                userData.pendingTasks.push(savedTask.id);
                userData.save();
            } catch (error) {
                return res.status(500).send({
                    message: "Error happens when updating user information",
                    data: error.toString()
                });
            }
        }
    
        return res.status(201).send({
            message: msg,
            data: savedTask
        });
    
    }).catch(function(err) {
        // Handle save error
        return res.status(500).send({
            message: 'Insert failed',
            error: err.toString()
        });
    });
});
    
    

    return router;

}