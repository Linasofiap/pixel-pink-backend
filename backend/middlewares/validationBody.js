const { body } = require('express-validator')

const users = [
    body('email', 'Email is required').normalizeEmail().notEmpty(),
    body('email', 'Email is not valid').normalizeEmail().isEmail(),
    body('password', 'Your password is not strong enough. It must contain at least one uppercase, lowercase, number and special character').isStrongPassword()
]

module.exports = users