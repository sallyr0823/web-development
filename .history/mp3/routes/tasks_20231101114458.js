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

}