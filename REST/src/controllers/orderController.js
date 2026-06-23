const orderService = require('../services/orderService');
const { validationResult } = require('express-validator');

/**
 * Order Controller
 * 
 * @description Handles HTTP requests for order operations
 * Validates input, calls service layer, and formats responses
 */

/**
 * Create Order
 * 
 * @route POST /api/orders
 * @description Create a new order
 * @access Private
 * 
 * @example
 * // Request Body:
 * // {
 * //   "items": [
 * //     { "productName": "Laptop", "quantity": 1, "price": 999.99 }
 * //   ],
 * //   "shippingAddress": {
 * //     "street": "123 Main St",
 * //     "city": "New York",
 * //     "state": "NY",
 * //     "zipCode": "10001",
 * //     "country": "USA"
 * //   }
 * // }
 * 
 * // Response:
 * // {
 * //   "success": true,
 * //   "data": {
 * //     "_id": "...",
 * //     "user": {...},
 * //     "items": [...],
 * //     "totalAmount": 999.99,
 * //     "status": "pending"
 * //   }
 * // }
 */
const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const order = await orderService.createOrder(req.body, req.user.userId);

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get Order by ID
 * 
 * @route GET /api/orders/:id
 * @description Get order by ID
 * @access Private
 * 
 * @example
 * // Response:
 * // {
 * //   "success": true,
 * //   "data": {
 * //     "_id": "...",
 * //     "user": {...},
 * //     "items": [...],
 * //     "totalAmount": 999.99,
 * //     "status": "pending"
 * //   }
 * // }
 */
const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user.userId);

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get Current User's Orders
 * 
 * @route GET /api/orders/my-orders
 * @description Get all orders for current user
 * @access Private
 * @query limit - Maximum number of orders (default: 10)
 * @query skip - Number of orders to skip (default: 0)
 * 
 * @example
 * // Response:
 * // {
 * //   "success": true,
 * //   "count": 2,
 * //   "data": [
 * //     { "_id": "...", "items": [...], "totalAmount": 999.99, "status": "pending" },
 * //     { "_id": "...", "items": [...], "totalAmount": 250.50, "status": "shipped" }
 * //   ]
 * // }
 */
const getMyOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    const orders = await orderService.getUserOrders(req.user.userId, limit, skip);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get All Orders
 * 
 * @route GET /api/orders
 * @description Get all orders (admin function)
 * @access Private
 * @query limit - Maximum number of orders (default: 10)
 * @query skip - Number of orders to skip (default: 0)
 * 
 * @example
 * // Response:
 * // {
 * //   "success": true,
 * //   "count": 5,
 * //   "data": [
 * //     { "_id": "...", "user": {...}, "items": [...], "totalAmount": 999.99 }
 * //   ]
 * // }
 */
const getAllOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    const orders = await orderService.getAllOrders(limit, skip);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get Orders by Status
 * 
 * @route GET /api/orders/status/:status
 * @description Get orders filtered by status
 * @access Private
 * @query limit - Maximum number of orders (default: 10)
 * @query skip - Number of orders to skip (default: 0)
 * 
 * @example
 * // Response:
 * // {
 * //   "success": true,
 * //   "count": 3,
 * //   "data": [
 * //     { "_id": "...", "status": "pending", "totalAmount": 999.99 }
 * //   ]
 * // }
 */
const getOrdersByStatus = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    const orders = await orderService.getOrdersByStatus(req.params.status, limit, skip);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update Order Status
 * 
 * @route PATCH /api/orders/:id/status
 * @description Update order status
 * @access Private
 * 
 * @example
 * // Request Body:
 * // { "status": "shipped" }
 * 
 * // Response:
 * // {
 * //   "success": true,
 * //   "data": {
 * //     "_id": "...",
 * //     "status": "shipped",
 * //     "updatedAt": "..."
 * //   }
 * // }
 */
const updateOrderStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status,
      req.user.userId
    );

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Cancel Order
 * 
 * @route PATCH /api/orders/:id/cancel
 * @description Cancel an order
 * @access Private
 * 
 * @example
 * // Response:
 * // {
 * //   "success": true,
 * //   "data": {
 * //     "_id": "...",
 * //     "status": "cancelled",
 * //     "updatedAt": "..."
 * //   }
 * // }
 */
const cancelOrder = async (req, res) => {
  try {
    const order = await orderService.cancelOrder(req.params.id, req.user.userId);

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Delete Order
 * 
 * @route DELETE /api/orders/:id
 * @description Delete an order (admin function)
 * @access Private
 * 
 * @example
 * // Response:
 * // {
 * //   "success": true,
 * //   "data": {
 * //     "_id": "...",
 * //     "status": "pending",
 * //     "totalAmount": 999.99
 * //   }
 * // }
 */
const deleteOrder = async (req, res) => {
  try {
    const order = await orderService.deleteOrder(req.params.id);

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  getOrdersByStatus,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
};

// Made with Bob
