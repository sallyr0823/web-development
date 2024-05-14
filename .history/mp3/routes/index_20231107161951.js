/*
 * Connect all of your endpoints together here.
    app.use: mount the specified middleware functions at the path
    app.use(path, callback)
 */


module.exports = function (app, router) {
    app.use('/api', require('./home.js').Router());
    app.use('/api/users',require('./user.js').Router());
    app.use('/api/user/:id',require('./userid.js').Router());
    app.use('/api/tasks',require('./tasks.js').Router());
    app.use('/app/tasks/:id',require('./tasksid.js').Router());
};
