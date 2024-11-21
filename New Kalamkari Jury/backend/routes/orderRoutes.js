const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const { 
  authenticate, 
  authorizeRoles 
} = require('../middleware/authentication');

// User routes
router.post('/new', 
  authenticate, 
  OrderController.newOrder
);

router.get('/me', 
  authenticate, 
  OrderController.myOrders
);

router.get('/:id', 
  authenticate, 
  OrderController.getSingleOrder
);

// Admin routes
router.get('/', 
  authenticate, 
  authorizeRoles('admin'), 
  OrderController.getAllOrders
);

router.put('/:id', 
  authenticate, 
  authorizeRoles('admin'), 
  OrderController.updateOrder
);

router.delete('/:id', 
  authenticate, 
  authorizeRoles('admin'), 
  OrderController.deleteOrder
);

module.exports = router;