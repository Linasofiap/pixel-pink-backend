const express = require('express') 
const router = express.Router()
const { newProduct, updateProduct, getProductById, getProductsByCollection, getProductsByCategory, getAllProducts, deleteProductById } = require('./../controllers/product.controller')
const { validateToken } = require('./../middlewares/validateToken')

router.post('/new-product', validateToken, newProduct)
router.put('/update-product/:id', validateToken, updateProduct)
router.get('/get-product/:id',  getProductById)
router.get('/get-all-products', getAllProducts)
router.get('/get-collection/:clotheCollection', getProductsByCollection)
router.get('/get-category/:category', getProductsByCategory)
router.delete('/delete-product/:id', deleteProductById)


module.exports = router