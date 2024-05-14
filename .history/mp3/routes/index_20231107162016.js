/*
 * Connect all of your endpoints together here.
    app.use: mount the specified middleware functions at the path
    app.use(path, callback)
 */


module.exports = function (app, router) {
    app.use('/api', require('./home.js'));
    app.use('/api/users',require('./user.js'));
    app.use('/api/user/:id',require('./userid.js'));
    app.use('/api/tasks',require('./tasks.js'));
    app.use('/app/tasks/:id',require('./tasksid.js'));
};
