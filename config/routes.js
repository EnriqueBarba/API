const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const productController = require('../controllers/product.controller');
const upload = require('./cloudinary.config');
const authMiddleware = require('../middlewares/auth.middleware')


router.post('/register', authMiddleware.isNotAuthenticated, userController.new);
router.post('/login', authMiddleware.isNotAuthenticated, userController.login);
router.post('/logout', authMiddleware.isAuthenticated, userController.logout);

//router.get('/profile', authMiddleware.isAuthenticated, userController.getProfile);
router.patch('/profile', authMiddleware.isAuthenticated, userController.updateProfile);

router.get('/products', productController.getAll)
router.get('/search/:cat', productController.searchByCat)
router.post('/product/new', authMiddleware.isAuthenticated, upload.array('image'), productController.new)
router.post('/product/update', authMiddleware.isAuthenticated, upload.array('image'), productController.update)
router.delete('/product/delete', authMiddleware.isAuthenticated, productController.delete)



module.exports = router;