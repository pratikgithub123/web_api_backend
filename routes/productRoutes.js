//importing
const router = require('express').Router();
const productController = require('../controllers/productControllers')
//making routes
router.post('/create_product',productController.createProduct)

//get all products
router.get("/get_products",productController.getProducts)

//exporting
module.exports=router;