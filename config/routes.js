const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const upload = require('./cloudinary.config');
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/register', userController.new);
router.post('/login', authMiddleware.isNotAuthenticated, userController.login);
router.post('/logout', authMiddleware.isAuthenticated, userController.logout);

//router.get('/profile', authMiddleware.isAuthenticated, userController.getProfile);
router.patch('/profile', authMiddleware.isAuthenticated, userController.updateProfile);


module.exports = router;