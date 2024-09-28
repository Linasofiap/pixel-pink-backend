const { Schema, model } = require('mongoose')

const userSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    name: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    phone: {
        type: Number,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    detail: {
        type: String,
        required: false
    },
    observations: {
        type: String,
        required: false
    }
})

module.exports = model( 'Users', userSchema )