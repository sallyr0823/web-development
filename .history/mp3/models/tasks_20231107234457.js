
var mongoose = require('mongoose');

var TasksSchema = new mongoose.Schema({
    name: String,
    description: String,
    deadline: Date,
    completed: Boolean,
    assignedUser: {type: string, ref: 'User',default: ""},
    assignedUserName:{type:String,default:'unassigned'},
    dateCreated: {type:Date,default: Date.now}
})

module.exports  = mongoose.model("Tasks", TasksSchema);