const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { 
  authenticate, 
  authorizeRoles 
} = require('../middleware/authentication');

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/verify-email/:token', AuthController.verifyEmail);
// router.post('/forgot-password', AuthController.forgotPassword);
// router.post('/reset-password/:token', AuthController.resetPassword);

// Protected routes
router.get('/profile', authenticate, AuthController.getUserProfile);
router.put('/profile/update', authenticate, AuthController.updateProfile);
// router.put('/password/change', authenticateUser, AuthController.changePassword);

// Admin routes
// router.get('/users', 
//   authenticateUser, 
//   authorizeRoles('admin'), 
//   AuthController.getAllUsers
// );

// router.get('/user/:id', 
//   authenticateUser, 
//   authorizeRoles('admin'), 
//   AuthController.getUserDetails
// );

module.exports = router;