const express = require('express') 
const router = express.Router()
const { createOrder, getOrderById } = require('./../controllers/order.controller')
const { validateToken } = require('./../middlewares/validateToken')


router.post('/order', validateToken, createOrder)
router.get('/get-order/:id', validateToken, getOrderById)

module.exports = router