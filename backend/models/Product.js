const { Schema, model } = require('mongoose')

const productSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    clotheCollection: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        required: true
    },
    imgA: {
        type: String,
        required: true
    },
    imgB: {
        type: String,
        required: true
    },
    imgC: {
        type: String,
        required: true
    }
})

module.exports = model( 'Products', productSchema )