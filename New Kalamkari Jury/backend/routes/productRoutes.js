const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { 
  authenticateUser, 
  authorizeRoles 
} = require('../middleware/authentication');

// Public routes
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductDetails);

// Protected routes
// router.post('/review', 
//   authenticateUser, 
//   ProductController.createProductReview
// );

// // Admin routes
router.post('/new', 
  authenticateUser, 
  authorizeRoles('admin'), 
  ProductController.createProduct
);

router.put('/:id', 
  authenticateUser, 
  authorizeRoles('admin'), 
  ProductController.updateProduct
);

router.delete('/:id', 
  authenticateUser, 
  authorizeRoles('admin'), 
  ProductController.deleteProduct
);

module.exports = router;