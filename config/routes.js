const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const productController = require('../controllers/product.controller');
const cartController = require('../controllers/cart.controller');
const orderController = require('../controllers/order.controller');
const upload = require('./cloudinary.config');
const authMiddleware = require('../middlewares/auth.middleware')


router.post('/register', authMiddleware.isNotAuthenticated, userController.new);
router.post('/login', authMiddleware.isNotAuthenticated, userController.login);
router.post('/logout', authMiddleware.isAuthenticated, userController.logout);

//router.get('/profile', authMiddleware.isAuthenticated, userController.getProfile);
router.post('/profile', authMiddleware.isAuthenticated, userController.updateProfile);

router.get('/search/:cat', productController.searchByCat)
router.get('/products/:search', productController.searchByName)

router.get('/products', productController.getAll)
router.get('/product/:flag', productController.getByFlag)
router.post('/product/new', authMiddleware.isAuthenticated, upload.array('image'), productController.new)
router.post('/product/update', authMiddleware.isAuthenticated, upload.array('image'), productController.update)
router.post('/product/delete', authMiddleware.isAuthenticated, productController.delete)

router.get('/orders', authMiddleware.isAuthenticated, orderController.getAll)
router.get('/order/:id', authMiddleware.isAuthenticated, orderController.getById)
router.post('/order/new', authMiddleware.isAuthenticated, orderController.new)
router.patch('/order/update', authMiddleware.isAuthenticated, orderController.update)
router.post('/order/delete', authMiddleware.isAuthenticated, orderController.delete)
router.post('/order/purchase', authMiddleware.isAuthenticated, orderController.purchase)

router.get('/cart', authMiddleware.isAuthenticated, cartController.get)
router.post('/cart/add', authMiddleware.isAuthenticated, cartController.add)
router.patch('/cart/update', authMiddleware.isAuthenticated, cartController.update)
router.post('/cart/purchase', authMiddleware.isAuthenticated, cartController.purchase)

/*
POST: "/product/buy"           // {} amount
POST: "/product/review"
POST: "/product/wishList"  // boolean
*/


module.exports = router;