const Order = require('../models/Order');

/**
 * Order Repository
 * 
 * @description Data access layer for Order model
 * Handles all database operations for orders
 */

/**
 * Find Order by ID
 * 
 * @description Retrieves an order by its ID with user population
 * @param {string} id - Order's MongoDB ObjectId
 * 
 * @example
 * // Sample Input: "507f1f77bcf86cd799439012"
 * // Sample Output: { _id: "...", user: {...}, items: [...], totalAmount: 1050.99, status: "pending" }
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
 * @param {number} limit - Maximum number of orders to return
 * @param {number} skip - Number of orders to skip
 * 
 * @example
 * // Sample Input: "507f1f77bcf86cd799439011", 10, 0
 * // Sample Output: [{ _id: "...", items: [...], totalAmount: 999.99, status: "pending" }, ...]
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
 * @param {number} limit - Maximum number of orders to return
 * @param {number} skip - Number of orders to skip
 * 
 * @example
 * // Sample Input: 10, 0
 * // Sample Output: [{ _id: "...", user: {...}, items: [...], totalAmount: 999.99 }, ...]
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
 * 
 * @example
 * // Sample Input: { user: "...", items: [...], totalAmount: 999.99, shippingAddress: {...} }
 * // Sample Output: { _id: "...", user: {...}, items: [...], totalAmount: 999.99, status: "pending" }
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
 * // Sample Input: "507f1f77bcf86cd799439012", { status: "shipped" }
 * // Sample Output: { _id: "...", status: "shipped", updatedAt: "..." }
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
 * // Sample Input: "507f1f77bcf86cd799439012"
 * // Sample Output: { _id: "...", status: "pending", totalAmount: 999.99 }
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

// Made with Bob
