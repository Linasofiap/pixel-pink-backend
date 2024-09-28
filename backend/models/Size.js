const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
  size: {
    type: String,
    enum: ['xs', 's', 'm', 'l', 'xl'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
});

module.exports = mongoose.model('Sizes', sizeSchema);