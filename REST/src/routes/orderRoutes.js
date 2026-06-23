const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/auth');
const { body } = require('express-validator');

/**
 * Order Routes
 * 
 * @description Defines all routes for order operations
 * Includes validation middleware and authentication
 */

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private
 */
router.post(
  '/',
  authMiddleware,
  [
    body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
    body('items.*.productName').trim().notEmpty().withMessage('Product name is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('shippingAddress.street').trim().notEmpty().withMessage('Street is required'),
    body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
    body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
    body('shippingAddress.zipCode').trim().notEmpty().withMessage('Zip code is required'),
    body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),
  ],
  orderController.createOrder
);

/**
 * @route   GET /api/orders/my-orders
 * @desc    Get current user's orders
 * @access  Private
 * @query   limit - Maximum number of orders (default: 10)
 * @query   skip - Number of orders to skip (default: 0)
 */
router.get('/my-orders', authMiddleware, orderController.getMyOrders);

/**
 * @route   GET /api/orders/status/:status
 * @desc    Get orders by status
 * @access  Private
 * @query   limit - Maximum number of orders (default: 10)
 * @query   skip - Number of orders to skip (default: 0)
 */
router.get('/status/:status', authMiddleware, orderController.getOrdersByStatus);

/**
 * @route   GET /api/orders
 * @desc    Get all orders (admin function)
 * @access  Private
 * @query   limit - Maximum number of orders (default: 10)
 * @query   skip - Number of orders to skip (default: 0)
 */
router.get('/', authMiddleware, orderController.getAllOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private
 */
router.get('/:id', authMiddleware, orderController.getOrderById);

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    Update order status
 * @access  Private
 */
router.patch(
  '/:id/status',
  authMiddleware,
  [
    body('status')
      .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Invalid status value'),
  ],
  orderController.updateOrderStatus
);

/**
 * @route   PATCH /api/orders/:id/cancel
 * @desc    Cancel an order
 * @access  Private
 */
router.patch('/:id/cancel', authMiddleware, orderController.cancelOrder);

/**
 * @route   DELETE /api/orders/:id
 * @desc    Delete an order (admin function)
 * @access  Private
 */
router.delete('/:id', authMiddleware, orderController.deleteOrder);

module.exports = router;

// Made with Bob
