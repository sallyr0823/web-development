// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    pendingTasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
    dateCreated: Date
});

var TaskSchema = new mongoose.Schema({
    name: String,
    description: String,
    deadline: Date,
    completed, Boolean,
    assignedUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User',default: ''},
    assignedUserName:{type:String,ref:'User'},
    dateCreated: {type:Date,defaulte: Date.now}
})

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
module.exports = mongoose.model('Task',TaskSchema);
