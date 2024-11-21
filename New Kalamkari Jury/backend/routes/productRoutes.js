const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { 
  authenticate, 
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
  authenticate, 
  authorizeRoles('admin'), 
  ProductController.createProduct
);

router.put('/:id', 
  authenticate, 
  authorizeRoles('admin'), 
  ProductController.updateProduct
);

router.delete('/:id', 
  authenticate, 
  authorizeRoles('admin'), 
  ProductController.deleteProduct
);

module.exports = router;