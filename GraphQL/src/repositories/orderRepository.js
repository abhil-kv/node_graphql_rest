const Order = require('../models/Order');

/**
 * Order Repository
 * 
 * @description Data access layer for Order model
 * Handles all database operations for orders
 * Separates business logic from data access
 */

/**
 * Find Order by ID
 * 
 * @description Retrieves an order by its ID with user population
 * @param {string} id - Order's MongoDB ObjectId
 * 
 * @example
 * // Sample Input:
 * // id = "507f1f77bcf86cd799439012"
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
 * @returns {Promise<Object|null>} Order object or null if not found
 */
const findById = async (id) => {
  try {
    return await Order.findById(id).populate('user', 'name email');
  } catch (error) {
    throw new Error(`Error finding order by ID: ${error.message}`);
  }
};

/**
 * Find Orders by User ID
 * 
 * @description Retrieves all orders for a specific user
 * @param {string} userId - User's MongoDB ObjectId
 * @param {number} limit - Maximum number of orders to return (default: 10)
 * @param {number} skip - Number of orders to skip (default: 0)
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
const findByUserId = async (userId, limit = 10, skip = 0) => {
  try {
    return await Order.find({ user: userId })
      .populate('user', 'name email')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error(`Error finding orders by user ID: ${error.message}`);
  }
};

/**
 * Find All Orders
 * 
 * @description Retrieves all orders with optional pagination
 * @param {number} limit - Maximum number of orders to return (default: 10)
 * @param {number} skip - Number of orders to skip (default: 0)
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
const findAll = async (limit = 10, skip = 0) => {
  try {
    return await Order.find()
      .populate('user', 'name email')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error(`Error finding all orders: ${error.message}`);
  }
};

/**
 * Find Orders by Status
 * 
 * @description Retrieves orders filtered by status
 * @param {string} status - Order status (pending, processing, shipped, delivered, cancelled)
 * @param {number} limit - Maximum number of orders to return (default: 10)
 * @param {number} skip - Number of orders to skip (default: 0)
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
const findByStatus = async (status, limit = 10, skip = 0) => {
  try {
    return await Order.find({ status })
      .populate('user', 'name email')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error(`Error finding orders by status: ${error.message}`);
  }
};

/**
 * Create Order
 * 
 * @description Creates a new order in the database
 * @param {Object} orderData - Order data object
 * @param {string} orderData.user - User's MongoDB ObjectId
 * @param {Array} orderData.items - Array of order items
 * @param {number} orderData.totalAmount - Total order amount
 * @param {Object} orderData.shippingAddress - Shipping address details
 * 
 * @example
 * // Sample Input:
 * // {
 * //   user: "507f1f77bcf86cd799439011",
 * //   items: [
 * //     { productName: "Laptop", quantity: 1, price: 999.99 }
 * //   ],
 * //   totalAmount: 999.99,
 * //   shippingAddress: {
 * //     street: "123 Main St",
 * //     city: "New York",
 * //     state: "NY",
 * //     zipCode: "10001",
 * //     country: "USA"
 * //   }
 * // }
 * 
 * // Sample Output:
 * // {
 * //   _id: "507f1f77bcf86cd799439012",
 * //   user: "507f1f77bcf86cd799439011",
 * //   items: [...],
 * //   totalAmount: 999.99,
 * //   status: "pending",
 * //   shippingAddress: {...},
 * //   createdAt: "2024-01-15T10:30:00.000Z",
 * //   updatedAt: "2024-01-15T10:30:00.000Z"
 * // }
 * 
 * @returns {Promise<Object>} Created order object
 */
const create = async (orderData) => {
  try {
    const order = new Order(orderData);
    await order.save();
    return await order.populate('user', 'name email');
  } catch (error) {
    throw new Error(`Error creating order: ${error.message}`);
  }
};

/**
 * Update Order
 * 
 * @description Updates an existing order
 * @param {string} id - Order's MongoDB ObjectId
 * @param {Object} updateData - Data to update
 * 
 * @example
 * // Sample Input:
 * // id = "507f1f77bcf86cd799439012"
 * // updateData = { status: "shipped" }
 * 
 * // Sample Output:
 * // {
 * //   _id: "507f1f77bcf86cd799439012",
 * //   user: {...},
 * //   items: [...],
 * //   totalAmount: 999.99,
 * //   status: "shipped",
 * //   shippingAddress: {...},
 * //   createdAt: "2024-01-15T10:30:00.000Z",
 * //   updatedAt: "2024-01-15T11:00:00.000Z"
 * // }
 * 
 * @returns {Promise<Object|null>} Updated order object or null if not found
 */
const update = async (id, updateData) => {
  try {
    return await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('user', 'name email');
  } catch (error) {
    throw new Error(`Error updating order: ${error.message}`);
  }
};

/**
 * Delete Order
 * 
 * @description Deletes an order from the database
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
 * //   totalAmount: 999.99,
 * //   status: "pending",
 * //   shippingAddress: {...},
 * //   createdAt: "2024-01-15T10:30:00.000Z",
 * //   updatedAt: "2024-01-15T10:30:00.000Z"
 * // }
 * 
 * @returns {Promise<Object|null>} Deleted order object or null if not found
 */
const deleteOrder = async (id) => {
  try {
    return await Order.findByIdAndDelete(id).populate('user', 'name email');
  } catch (error) {
    throw new Error(`Error deleting order: ${error.message}`);
  }
};

module.exports = {
  findById,
  findByUserId,
  findAll,
  findByStatus,
  create,
  update,
  deleteOrder,
};

