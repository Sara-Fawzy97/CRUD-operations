const mongoose = require('mongoose')
    // const validator = require('validator')
const taskSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        require: true
    },
    description: {
        type: String,
        trim: true,
        require: true

    },
    completed: {
        type: Boolean,
        default: false,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    }
})
const Task = mongoose.model('Task', taskSchema)

module.exports = Task