const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    bgl: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})

const Log = module.exports = mongoose.model('Log', logSchema);

