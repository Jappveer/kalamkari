const Product = require('../models/Product');
const ApiFeatures = require('../utils/apiFeatures');

class ProductController {
  // Create a new product
  static async createProduct(req, res) {
    try {
      // Add user ID to the product
      req.body.user = req.user.id;

      const product = await Product.create(req.body);
      
      res.status(201).json({
        success: true,
        product
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get all products with filtering and pagination
  static async getAllProducts(req, res) {
    try {
      const resultsPerPage = 8;
      const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultsPerPage);

      const products = await apiFeature.query;
      const totalProductsCount = await Product.countDocuments();

      res.status(200).json({
        success: true,
        products,
        resultsPerPage,
        totalProductsCount
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get product details
  static async getProductDetails(req, res) {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(200).json({
        success: true,
        product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update product
  static async updateProduct(req, res) {
    try {
      let product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
      });

      res.status(200).json({
        success: true,
        product
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Delete product
  static async deleteProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      await product.deleteOne();

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = ProductController;