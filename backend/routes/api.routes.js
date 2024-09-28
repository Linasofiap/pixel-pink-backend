const express = require('express')
const router = express.Router()
const user = require('./user.routes')
const suscribe = require('./suscribe.routes')
const product = require('./product.route')
const order = require('./order.route')

router.use('/api', user)
router.use('/api', suscribe)
router.use('/api', product)
router.use('/api', order)


module.exports = router