const orderRepository = require('../repositories/orderRepository');
const userRepository = require('../repositories/userRepository');

/**
 * Order Service
 * 
 * @description Business logic layer for Order operations
 * Handles order validation, authorization, and management
 */

/**
 * Create Order
 * 
 * @description Creates a new order for authenticated user
 * @param {Object} orderData - Order data
 * @param {string} userId - ID of user creating the order
 * 
 * @example
 * // Sample Input: { items: [...], shippingAddress: {...} }, "507f1f77bcf86cd799439011"
 * // Sample Output: { _id: "...", user: {...}, items: [...], totalAmount: 999.99, status: "pending" }
 * 
 * @returns {Promise<Object>} Created order object
 */
const createOrder = async (orderData, userId) => {
  try {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    const totalAmount = orderData.items.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);

    const order = await orderRepository.create({
      ...orderData,
      user: userId,
      totalAmount,
    });

    return order;
  } catch (error) {
    throw new Error(`Error creating order: ${error.message}`);
  }
};

/**
 * Get Order by ID
 * 
 * @description Retrieves order by ID with authorization check
 * @param {string} id - Order's MongoDB ObjectId
 * @param {string} userId - ID of user requesting the order
 * 
 * @example
 * // Sample Input: "507f1f77bcf86cd799439012", "507f1f77bcf86cd799439011"
 * // Sample Output: { _id: "...", user: {...}, items: [...], totalAmount: 999.99 }
 * 
 * @returns {Promise<Object>} Order object
 */
const getOrderById = async (id, userId) => {
  try {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.user._id.toString() !== userId) {
      throw new Error('Unauthorized: You can only view your own orders');
    }

    return order;
  } catch (error) {
    throw new Error(`Error getting order: ${error.message}`);
  }
};

/**
 * Get User Orders
 * 
 * @description Retrieves all orders for a specific user
 * @param {string} userId - User's MongoDB ObjectId
 * @param {number} limit - Maximum number of orders to return
 * @param {number} skip - Number of orders to skip
 * 
 * @example
 * // Sample Input: "507f1f77bcf86cd799439011", 10, 0
 * // Sample Output: [{ _id: "...", items: [...], totalAmount: 999.99 }, ...]
 * 
 * @returns {Promise<Array>} Array of order objects
 */
const getUserOrders = async (userId, limit = 10, skip = 0) => {
  try {
    return await orderRepository.findByUserId(userId, limit, skip);
  } catch (error) {
    throw new Error(`Error getting user orders: ${error.message}`);
  }
};

/**
 * Get All Orders
 * 
 * @description Retrieves all orders (admin function)
 * @param {number} limit - Maximum number of orders to return
 * @param {number} skip - Number of orders to skip
 * 
 * @example
 * // Sample Input: 10, 0
 * // Sample Output: [{ _id: "...", user: {...}, items: [...], totalAmount: 999.99 }, ...]
 * 
 * @returns {Promise<Array>} Array of order objects
 */
const getAllOrders = async (limit = 10, skip = 0) => {
  try {
    return await orderRepository.findAll(limit, skip);
  } catch (error) {
    throw new Error(`Error getting all orders: ${error.message}`);
  }
};

/**
 * Get Orders by Status
 * 
 * @description Retrieves orders filtered by status
 * @param {string} status - Order status
 * @param {number} limit - Maximum number of orders to return
 * @param {number} skip - Number of orders to skip
 * 
 * @example
 * // Sample Input: "pending", 10, 0
 * // Sample Output: [{ _id: "...", status: "pending", totalAmount: 999.99 }, ...]
 * 
 * @returns {Promise<Array>} Array of order objects
 */
const getOrdersByStatus = async (status, limit = 10, skip = 0) => {
  try {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    return await orderRepository.findByStatus(status, limit, skip);
  } catch (error) {
    throw new Error(`Error getting orders by status: ${error.message}`);
  }
};

/**
 * Update Order Status
 * 
 * @description Updates order status with authorization check
 * @param {string} id - Order's MongoDB ObjectId
 * @param {string} status - New order status
 * @param {string} userId - ID of user updating the order
 * 
 * @example
 * // Sample Input: "507f1f77bcf86cd799439012", "shipped", "507f1f77bcf86cd799439011"
 * // Sample Output: { _id: "...", status: "shipped", updatedAt: "..." }
 * 
 * @returns {Promise<Object>} Updated order object
 */
const updateOrderStatus = async (id, status, userId) => {
  try {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.user._id.toString() !== userId) {
      throw new Error('Unauthorized: You can only update your own orders');
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const updatedOrder = await orderRepository.update(id, { status });
    return updatedOrder;
  } catch (error) {
    throw new Error(`Error updating order status: ${error.message}`);
  }
};

/**
 * Cancel Order
 * 
 * @description Cancels an order (sets status to cancelled)
 * @param {string} id - Order's MongoDB ObjectId
 * @param {string} userId - ID of user cancelling the order
 * 
 * @example
 * // Sample Input: "507f1f77bcf86cd799439012", "507f1f77bcf86cd799439011"
 * // Sample Output: { _id: "...", status: "cancelled", updatedAt: "..." }
 * 
 * @returns {Promise<Object>} Cancelled order object
 */
const cancelOrder = async (id, userId) => {
  try {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.user._id.toString() !== userId) {
      throw new Error('Unauthorized: You can only cancel your own orders');
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      throw new Error('Cannot cancel order that has been shipped or delivered');
    }

    if (order.status === 'cancelled') {
      throw new Error('Order is already cancelled');
    }

    const updatedOrder = await orderRepository.update(id, { status: 'cancelled' });
    return updatedOrder;
  } catch (error) {
    throw new Error(`Error cancelling order: ${error.message}`);
  }
};

/**
 * Delete Order
 * 
 * @description Deletes an order (admin function)
 * @param {string} id - Order's MongoDB ObjectId
 * 
 * @example
 * // Sample Input: "507f1f77bcf86cd799439012"
 * // Sample Output: { _id: "...", status: "pending", totalAmount: 999.99 }
 * 
 * @returns {Promise<Object>} Deleted order object
 */
const deleteOrder = async (id) => {
  try {
    const order = await orderRepository.deleteOrder(id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  } catch (error) {
    throw new Error(`Error deleting order: ${error.message}`);
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  getOrdersByStatus,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
};

// Made with Bob
