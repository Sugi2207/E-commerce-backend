const ProductController = require('../Controller/Product Controller')
const express = require('express')
const router = express.Router();
const LoginController =require('../Controller/LoginController');
const authorization = require('../Middleware/Authorization');
const Cartcontroller= require('../Controller/CartController');
const Ordercontroller = require('../Controller/OrderController');

router.get('/',authorization,ProductController.getProducts);
router.post('/addproducts',ProductController.postProducts);
router.put('/updateproducts',ProductController.updateProduct);
router.delete('/deleteproduct',ProductController.deleteproduct);
router.post('/adduser',LoginController.postuser);
router.post('/jwt',LoginController.login);
router.post('/cart',authorization,Cartcontroller.addToCart);
router.get('/viewcart',authorization,Cartcontroller.viewCart);
router.post('/deletecart',authorization,Cartcontroller.deletecart);
router.delete('/deletecartproducts/:id',authorization,Cartcontroller.deletecartproducts);
router.post('/placeorder/:id',authorization,Ordercontroller.placeorder);
router.get('/vieworders',authorization,Ordercontroller.getOrder);

module.exports=router;