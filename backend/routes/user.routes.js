const express = require('express') 
const router = express.Router()
const { createUser, loginUser, getDataById, updateUserData, deleteUserData } = require('./../controllers/user.controller')
const users = require('./../middlewares/validationBody')
const validateFields = require('./../middlewares/validationResult')
const { validateToken } = require('./../middlewares/validateToken')


router.post('/register', users, validateFields, createUser)
router.post('/login', loginUser)
router.get('/data/:id', validateToken, getDataById)
router.put('/update-data/:id', validateToken, updateUserData)
router.delete('/delete-data/:id', validateToken, deleteUserData)

module.exports = router