const orderRepository = require('../repositories/orderRepository');
const userRepository = require('../repositories/userRepository');

/**
 * Order Service
 * 
 * @description Business logic layer for Order operations
 * Handles order validation, authorization, and management
 * Acts as intermediary between resolvers and repository
 */

/**
 * Create Order
 * 
 * @description Creates a new order for authenticated user
 * @param {Object} orderData - Order data
 * @param {Array} orderData.items - Array of order items
 * @param {Object} orderData.shippingAddress - Shipping address
 * @param {string} userId - ID of user creating the order
 * 
 * @example
 * // Sample Input:
 * // orderData = {
 * //   items: [
 * //     { productName: "Laptop", quantity: 1, price: 999.99 },
 * //     { productName: "Mouse", quantity: 2, price: 25.50 }
 * //   ],
 * //   shippingAddress: {
 * //     street: "123 Main St",
 * //     city: "New York",
 * //     state: "NY",
 * //     zipCode: "10001",
 * //     country: "USA"
 * //   }
 * // }
 * // userId = "507f1f77bcf86cd799439011"
 * 
 * // Sample Output:
 * // {
 * //   _id: "507f1f77bcf86cd799439012",
 * //   user: {
 * //     _id: "507f1f77bcf86cd799439011",
 * //     name: "John Doe",
 * //     email: "john@example.com"
 * //   },
 * //   items: [...],
 * //   totalAmount: 1050.99,
 * //   status: "pending",
 * //   shippingAddress: {...},
 * //   createdAt: "2024-01-15T10:30:00.000Z",
 * //   updatedAt: "2024-01-15T10:30:00.000Z"
 * // }
 * 
 * @returns {Promise<Object>} Created order object
 * @throws {Error} If validation fails or user not found
 */
const createOrder = async (orderData, userId) => {
  try {
    // Verify user exists
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate items
    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    // Calculate total amount
    const totalAmount = orderData.items.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);

    // Create order with user ID
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
 * // Sample Input:
 * // id = "507f1f77bcf86cd799439012"
 * // userId = "507f1f77bcf86cd799439011"
 * 
 * // Sample Output:
 * // {
 * //   _id: "507f1f77bcf86cd799439012",
 * //   user: {
 * //     _id: "507f1f77bcf86cd799439011",
 * //     name: "John Doe",
 * //     email: "john@example.com"
 * //   },
 * //   items: [...],
 * //   totalAmount: 1050.99,
 * //   status: "pending",
 * //   shippingAddress: {...},
 * //   createdAt: "2024-01-15T10:30:00.000Z",
 * //   updatedAt: "2024-01-15T10:30:00.000Z"
 * // }
 * 
 * @returns {Promise<Object>} Order object
 * @throws {Error} If order not found or unauthorized
 */
const getOrderById = async (id, userId) => {
  try {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }

    // Check authorization - users can only view their own orders
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
 * // Sample Input:
 * // userId = "507f1f77bcf86cd799439011"
 * // limit = 10, skip = 0
 * 
 * // Sample Output:
 * // [
 * //   {
 * //     _id: "507f1f77bcf86cd799439012",
 * //     user: "507f1f77bcf86cd799439011",
 * //     items: [...],
 * //     totalAmount: 1050.99,
 * //     status: "pending",
 * //     shippingAddress: {...},
 * //     createdAt: "2024-01-15T10:30:00.000Z",
 * //     updatedAt: "2024-01-15T10:30:00.000Z"
 * //   },
 * //   { ... }
 * // ]
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
 * // Sample Input:
 * // limit = 10, skip = 0
 * 
 * // Sample Output:
 * // [
 * //   {
 * //     _id: "507f1f77bcf86cd799439012",
 * //     user: {
 * //       _id: "507f1f77bcf86cd799439011",
 * //       name: "John Doe",
 * //       email: "john@example.com"
 * //     },
 * //     items: [...],
 * //     totalAmount: 1050.99,
 * //     status: "pending",
 * //     shippingAddress: {...},
 * //     createdAt: "2024-01-15T10:30:00.000Z",
 * //     updatedAt: "2024-01-15T10:30:00.000Z"
 * //   },
 * //   { ... }
 * // ]
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
 * // Sample Input:
 * // status = "pending"
 * // limit = 10, skip = 0
 * 
 * // Sample Output:
 * // [
 * //   {
 * //     _id: "507f1f77bcf86cd799439012",
 * //     user: {...},
 * //     items: [...],
 * //     totalAmount: 1050.99,
 * //     status: "pending",
 * //     shippingAddress: {...},
 * //     createdAt: "2024-01-15T10:30:00.000Z",
 * //     updatedAt: "2024-01-15T10:30:00.000Z"
 * //   }
 * // ]
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
 * // Sample Input:
 * // id = "507f1f77bcf86cd799439012"
 * // status = "shipped"
 * // userId = "507f1f77bcf86cd799439011"
 * 
 * // Sample Output:
 * // {
 * //   _id: "507f1f77bcf86cd799439012",
 * //   user: {...},
 * //   items: [...],
 * //   totalAmount: 1050.99,
 * //   status: "shipped",
 * //   shippingAddress: {...},
 * //   createdAt: "2024-01-15T10:30:00.000Z",
 * //   updatedAt: "2024-01-15T11:00:00.000Z"
 * // }
 * 
 * @returns {Promise<Object>} Updated order object
 * @throws {Error} If order not found or unauthorized
 */
const updateOrderStatus = async (id, status, userId) => {
  try {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }

    // Check authorization - users can only update their own orders
    if (order.user._id.toString() !== userId) {
      throw new Error('Unauthorized: You can only update your own orders');
    }

    // Validate status
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
 * // Sample Input:
 * // id = "507f1f77bcf86cd799439012"
 * // userId = "507f1f77bcf86cd799439011"
 * 
 * // Sample Output:
 * // {
 * //   _id: "507f1f77bcf86cd799439012",
 * //   user: {...},
 * //   items: [...],
 * //   totalAmount: 1050.99,
 * //   status: "cancelled",
 * //   shippingAddress: {...},
 * //   createdAt: "2024-01-15T10:30:00.000Z",
 * //   updatedAt: "2024-01-15T11:00:00.000Z"
 * // }
 * 
 * @returns {Promise<Object>} Cancelled order object
 * @throws {Error} If order not found, unauthorized, or already shipped/delivered
 */
const cancelOrder = async (id, userId) => {
  try {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }

    // Check authorization
    if (order.user._id.toString() !== userId) {
      throw new Error('Unauthorized: You can only cancel your own orders');
    }

    // Check if order can be cancelled
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
 * // Sample Input:
 * // id = "507f1f77bcf86cd799439012"
 * 
 * // Sample Output:
 * // {
 * //   _id: "507f1f77bcf86cd799439012",
 * //   user: {...},
 * //   items: [...],
 * //   totalAmount: 1050.99,
 * //   status: "pending",
 * //   shippingAddress: {...},
 * //   createdAt: "2024-01-15T10:30:00.000Z",
 * //   updatedAt: "2024-01-15T10:30:00.000Z"
 * // }
 * 
 * @returns {Promise<Object>} Deleted order object
 * @throws {Error} If order not found
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
