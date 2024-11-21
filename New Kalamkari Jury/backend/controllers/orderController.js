const Order = require('../models/Order');
const Product = require('../models/Product');

class OrderController {
  // Create new order
  static async newOrder(req, res) {
    try {
      const {
        shippingInfo,
        orderItems,
        paymentInfo,
        totalPrice
      } = req.body;

      const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
      });

      res.status(201).json({
        success: true,
        order
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get single order details
  static async getSingleOrder(req, res) {
    try {
      const order = await Order.findById(req.params.id)
        .populate('user', 'name email');

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(200).json({
        success: true,
        order
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get logged-in user orders
  static async myOrders(req, res) {
    try {
      const orders = await Order.find({ user: req.user._id });

      res.status(200).json({
        success: true,
        orders
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get all orders (Admin)
  static async getAllOrders(req, res) {
    try {
      const orders = await Order.find();

      let totalAmount = 0;
      orders.forEach(order => {
        totalAmount += order.totalPrice;
      });

      res.status(200).json({
        success: true,
        totalAmount,
        orders
      });
    } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message
        });
      }
    }
    // Update order status (Admin)
    static async updateOrder(req, res) {
        try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
            success: false,
            message: 'Order not found'
            });
        }

        if (order.orderStatus === 'Delivered') {
            return res.status(400).json({
            success: false,
            message: 'Order already delivered'
            });
        }

        // Update stock when order is processed
        if (req.body.status === 'Shipped') {
            order.orderItems.forEach(async (item) => {
            await updateStock(item.product, -item.quantity);
            });
        }

        order.orderStatus = req.body.status;

        if (req.body.status === 'Delivered') {
            order.deliveredAt = Date.now();
        }

        await order.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            order
        });
        } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
        }
    }

    // Delete order (Admin)
    static async deleteOrder(req, res) {
        try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
            success: false,
            message: 'Order not found'
            });
        }

        await order.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
        } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
        }
    }
    }

    // Helper function to update product stock
    async function updateStock(productId, quantity) {
    const product = await Product.findById(productId);

    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
    }

    module.exports = OrderController;