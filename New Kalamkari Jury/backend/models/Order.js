const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    pinCode: {
      type: Number,
      required: [true, 'Pin Code is required']
    },
    phoneNo: {
      type: String,
      required: [true, 'Phone number is required']
    }
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      }
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paymentInfo: {
    id: {
      type: String
    },
    status: {
      type: String,
      enum: ['Pending', 'Succeeded', 'Failed']
    }
  },
  paidAt: {
    type: Date
  },
  totalPrice: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Order', OrderSchema);