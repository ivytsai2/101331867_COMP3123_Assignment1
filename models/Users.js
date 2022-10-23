const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        maxLength: 100,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        maxLength: 50,
        required: true,
        trim: true
    },
    password: {
        type: String,
        maxLength: 60,
        required: true,
        trim: true
    }
})

module.exports = mongoose.model('user', userSchema)