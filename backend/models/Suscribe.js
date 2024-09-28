const { Schema, model } = require('mongoose')

const suscribeSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = model( 'Suscribers', suscribeSchema )