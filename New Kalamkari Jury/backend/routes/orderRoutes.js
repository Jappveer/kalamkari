const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const { 
  authenticateUser, 
  authorizeRoles 
} = require('../middleware/authentication');

// User routes
router.post('/new', 
  authenticateUser, 
  OrderController.newOrder
);

router.get('/me', 
  authenticateUser, 
  OrderController.myOrders
);

router.get('/:id', 
  authenticateUser, 
  OrderController.getSingleOrder
);

// Admin routes
router.get('/', 
  authenticateUser, 
  authorizeRoles('admin'), 
  OrderController.getAllOrders
);

router.put('/:id', 
  authenticateUser, 
  authorizeRoles('admin'), 
  OrderController.updateOrder
);

router.delete('/:id', 
  authenticateUser, 
  authorizeRoles('admin'), 
  OrderController.deleteOrder
);

module.exports = router;