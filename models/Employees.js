const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    first_name: {
        type: String,
        maxLength: 100,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        maxLength: 50,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true, 
        required: true,
        maxLength: 50,
        trim: true
    },
    gender: {
        type: String,
        maxLength: 25,
        enum: ['male', 'female', 'other'],
        default: 'other',
        lowercase: true,
        trim: true
    },
    salary: {
        type: Number,
        required: true,
        min: [0, 'The minimum is zero.'],
        trim: true
    }
})

module.exports = mongoose.model('employee', employeeSchema)