var secrets = require('../config/secrets');

module.exports = function (router) {

    var userRoute = router.route('/user');

    userRoute.get(function (req, res) {
        let where = req.query.where;
        let sort = req.query.sort;
        let select = req.query.select;
        let skip = req.query.skip;
        let count = req.query.count;
        let limit = parseInt(req.query.limit)||100;

        let result = User.find(where)
    });

    return router;
}

