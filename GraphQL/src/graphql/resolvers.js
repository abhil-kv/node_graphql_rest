const userService = require('../services/userService');
const orderService = require('../services/orderService');
const { requireAuth } = require('../middleware/auth');

/**
 * GraphQL Resolvers
 * 
 * @description Resolver functions that handle GraphQL queries and mutations
 * Each resolver receives (args, context) where:
 * - args: Input arguments from the GraphQL query/mutation
 * - context: Request context including user authentication info
 * 
 * Resolvers are organized into:
 * - Query resolvers: Handle read operations
 * - Mutation resolvers: Handle write operations
 */

const resolvers = {
  /**
   * Query Resolvers
   * Handle all read operations for users and orders
   */

  /**
   * Get User by ID
   * 
   * @param {Object} args - Query arguments
   * @param {string} args.id - User's ID
   * @param {Object} context - Request context
   * 
   * @example
   * // GraphQL Query:
   * // query {
   * //   user(id: "507f1f77bcf86cd799439011") {
   * //     _id
   * //     name
   * //     email
   * //   }
   * // }
   * 
   * // Sample Output:
   * // {
   * //   "_id": "507f1f77bcf86cd799439011",
   * //   "name": "John Doe",
   * //   "email": "john@example.com"
   * // }
   * 
   * @returns {Promise<Object>} User object
   */
  user: async (args, context) => {
    requireAuth(context);
    return await userService.getUserById(args.id);
  },

  /**
   * Get All Users
   * 
   * @param {Object} args - Query arguments
   * @param {number} args.limit - Maximum number of users (default: 10)
   * @param {number} args.skip - Number of users to skip (default: 0)
   * @param {Object} context - Request context
   * 
   * @example
   * // GraphQL Query:
   * // query {
   * //   users(limit: 5, skip: 0) {
   * //     _id
   * //     name
   * //     email
   * //   }
   * // }
   * 
   * // Sample Output:
   * // [
   * //   { "_id": "507f1f77bcf86cd799439011", "name": "John Doe", "email": "john@example.com" },
   * //   { "_id": "507f1f77bcf86cd799439012", "name": "Jane Smith", "email": "jane@example.com" }
   * // ]
   * 
   * @returns {Promise<Array>} Array of user objects
   */
  users: async (args, context) => {
    requireAuth(context);
    const limit = args.limit || 10;
    const skip = args.skip || 0;
    return await userService.getAllUsers(limit, skip);
  },

  /**
   * Get Current User
   * 
   * @param {Object} args - Query arguments (none)
   * @param {Object} context - Request context
   * 
   * @example
   * // GraphQL Query:
   * // query {
   * //   me {
   * //     _id
   * //     name
   * //     email
   * //   }
   * // }
   * 
   * // Sample Output:
   * // {
   * //   "_id": "507f1f77bcf86cd799439011",
   * //   "name": "John Doe",
   * //   "email": "john@example.com"
   * // }
   * 
   * @returns {Promise<Object>} Current user object
   */
  me: async (args, context) => {
    const user = requireAuth(context);
    return await userService.getUserById(user.userId);
  },

  /**
   * Get Order by ID
   * 
   * @param {Object} args - Query arguments
   * @param {string} args.id - Order's ID
   * @param {Object} context - Request context
   * 
   * @example
   * // GraphQL Query:
   * // query {
   * //   order(id: "507f1f77bcf86cd799439012") {
   * //     _id
   * //     totalAmount
   * //     status
   * //     items {
   * //       productName
   * //       quantity
   * //       price
   * //     }
   * //   }
   * // }
   * 
   * // Sample Output:
   * // {
   * //   "_id": "507f1f77bcf86cd799439012",
   * //   "totalAmount": 1050.99,
   * //   "status": "pending",
   * //   "items": [
   * //     { "productName": "Laptop", "quantity": 1, "price": 999.99 }
   * //   ]
   * // }
   * 
   * @returns {Promise<Object>} Order object
   */
  order: async (args, context) => {
    const user = requireAuth(context);
    return await orderService.getOrderById(args.id, user.userId);
  },

  /**
   * Get Current User's Orders
   * 
   * @param {Object} args - Query arguments
   * @param {number} args.limit - Maximum number of orders (default: 10)
   * @param {number} args.skip - Number of orders to skip (default: 0)
   * @param {Object} context - Request context
   * 
   * @example
   * // GraphQL Query:
   * // query {
   * //   myOrders(limit: 5) {
   * //     _id
   * //     totalAmount
   * //     status
   * //   }
   * // }
   * 
   * // Sample Output:
   * // [
   * //   { "_id": "507f1f77bcf86cd799439012", "totalAmount": 1050.99, "status": "pending" },
   * //   { "_id": "507f1f77bcf86cd799439013", "totalAmount": 250.50, "status": "shipped" }
   * // ]
   * 
   * @returns {Promise<Array>} Array of order objects
   */
  myOrders: async (args, context) => {
    const user = requireAuth(context);
    const limit = args.limit || 10;
    const skip = args.skip || 0;
    return await orderService.getUserOrders(user.userId, limit, skip);
  },

  /**
   * Get All Orders
   * 
   * @param {Object} args - Query arguments
   * @param {number} args.limit - Maximum number of orders (default: 10)
   * @param {number} args.skip - Number of orders to skip (default: 0)
   * @param {Object} context - Request context
   * 
   * @example
   * // GraphQL Query:
   * // query {
   * //   orders(limit: 10) {
   * //     _id
   * //     user {
   * //       name
   * //       email
   * //     }
   * //     totalAmount
   * //     status
   * //   }
   * // }
   * 
   * // Sample Output:
   * // [
   * //   {
   * //     "_id": "507f1f77bcf86cd799439012",
   * //     "user": { "name": "John Doe", "email": "john@example.com" },
   * //     "totalAmount": 1050.99,
   * //     "status": "pending"
   * //   }
   * // ]
   * 
   * @returns {Promise<Array>} Array of order objects
   */
  orders: async (args, context) => {
    requireAuth(context);
    const limit = args.limit || 10;
    const skip = args.skip || 0;
    return await orderService.getAllOrders(limit, skip);
  },

  /**
   * Get Orders by Status
   * 
   * @param {Object} args - Query arguments
   * @param {string} args.status - Order status to filter by
   * @param {number} args.limit - Maximum number of orders (default: 10)
   * @param {number} args.skip - Number of orders to skip (default: 0)
   * @param {Object} context - Request context
   * 
   * @example
   * // GraphQL Query:
   * // query {
   * //   ordersByStatus(status: "pending") {
   * //     _id
   * //     totalAmount
   * //     status
   * //   }
   * // }
   * 
   * // Sample Output:
   * // [
   * //   { "_id": "507f1f77bcf86cd799439012", "totalAmount": 1050.99, "status": "pending" }
   * // ]
   * 
   * @returns {Promise<Array>} Array of order objects
   */
  ordersByStatus: async (args, context) => {
    requireAuth(context);
    const limit = args.limit || 10;
    const skip = args.skip || 0;
    return await orderService.getOrdersByStatus(args.status, limit, skip);
  },

  /**
   * Mutation Resolvers
   * Handle all write operations for users and orders
   */

  /**
   * Register New User
   * 
   * @param {Object} args - Mutation arguments
   * @param {string} args.name - User's name
   * @param {string} args.email - User's email
   * @param {string} args.password - User's password
   * @param {Object} context - Request context
   * 
   * @example
   * // GraphQL Mutation:
   * // mutation {
   * //   register(
   * //     name: "John Doe",
   * //     email: "john@example.com",
   * //     password: "password123"
   * //   ) {
   * //     user {
   * //       _id
   * //       name
   * //       email
   * //     }
   * //     token
   * //   }
   * // }
   * 
   * // Sample Output:
   * // {
   * //   "user": {
   * //     "_id": "507f1f77bcf86cd799439011",
   * //     "name": "John Doe",
   * //     "email": "john@example.com"
   * //   },
   * //   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * // }
   * 
   * @returns {Promise<Object>} AuthPayload with user and token
   */
  register: async (args) => {
    return await userService.register({
      name: args.name,
      email: args.email,
      password: args.password,
    });
  },

  /**
   * Login User
   * 
   * @param {Object} args - Mutation arguments
   * @param {string} args.email - User's email
   * @param {string} args.password - User's password
   * @param {Object} context - Request context
   * 
   * @example
   * // GraphQL Mutation:
   * // mutation {
   * //   login(
   * //     email: "john@example.com",
   * //     password: "password123"
   * //   ) {
   * //     user {
   * //       _id
   * //       name
   * //       email
   * //     }
   * //     token
   * //   }
   * // }
   * 
   * // Sample Output:
   * // {
   * //   "user": {
   * //     "_id": "507f1f77bcf86cd799439011",
   * //     "name": "John Doe",
   * //     "email": "john@example.com"
   * //   },
   * //   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * // }
   * 
   * @returns {Promise<Object>} AuthPayload with user and token
   */
  login: async (args) => {
    return await userService.login(args.email, args.password);
  },

  /**
   * Update User
   * 
   * @param {Object} args - Mutation arguments
   * @param {string} args.id - User's ID
   * @param {string} args.name - New name (optional)
   * @param {string} args.email - New email (optional)
   * @param {Object} context - Request context
   * 
   * @example
   * // GraphQL Mutation:
   * // mutation {
   * //   updateUser(
   * //     id: "507f1f77bcf86cd799439011",
   * //     name: "Jane Doe"
   * //   ) {
   * //     _id
   * //     name
   * //     email
   * //   }
   * // }
   * 
   * // Sample Output:
   * // {
   * //   "_id": "507f1f77bcf86cd799439011",
   * //   "name": "Jane Doe",
   * //   "email": "john@example.com"
   * // }
   * 
   * @returns {Promise<Object>} Updated user object
   */
  updateUser: async (args, context) => {
    const user = requireAuth(context);
    const updateData = {};
    if (args.name) updateData.name = args.name;
    if (args.email) updateData.email = args.email;
    return await userService.updateUser(args.id, updateData, user.userId);
  },

  /**
   * Delete User
   * 
   * @param {Object} args - Mutation arguments
   * @param {string} args.id - User's ID
   * @param {Object} context - Request context
   * 
   * @example
   * // GraphQL Mutation:
   * // mutation {
   * //   deleteUser(id: "507f1f77bcf86cd799439011") {
   * //     _id
   * //     name
   * //     email
   * //   }
   * // }
   * 
   * // Sample Output:
   * // {
   * //   "_id": "507f1f77bcf86cd799439011",
   * //   "name": "John Doe",
   * //   "email": "john@example.com"
   * // }
   * 
   * @returns {Promise<Object>} Deleted user object
   */
  deleteUser: async (args, context) => {
    const user = requireAuth(context);
    return await userService.deleteUser(args.id, user.userId);
  },

  /**
   * Create Order
   * 
   * @param {Object} args - Mutation arguments
   * @param {Array} args.items - Array of order items
   * @param {Object} args.shippingAddress - Shipping address
   * @param {Object} context - Request context
   * 
   * @example
   * // GraphQL Mutation:
   * // mutation {
   * //   createOrder(
   * //     items: [
   * //       { productName: "Laptop", quantity: 1, price: 999.99 }
   * //     ],
   * //     shippingAddress: {
   * //       street: "123 Main St",
   * //       city: "New York",
   * //       state: "NY",
   * //       zipCode: "10001",
   * //       country: "USA"
   * //     }
   * //   ) {
   * //     _id
   * //     totalAmount
   * //     status
   * //   }
   * // }
   * 
   * // Sample Output:
   * // {
   * //   "_id": "507f1f77bcf86cd799439012",
   * //   "totalAmount": 999.99,
   * //   "status": "pending"
   * // }
   * 
   * @returns {Promise<Object>} Created order object
   */
  createOrder: async (args, context) => {
    const user = requireAuth(context);
    return await orderService.createOrder(
      {
        items: args.items,
        shippingAddress: args.shippingAddress,
      },
      user.userId
    );
  },

  /**
   * Update Order Status
   * 
   * @param {Object} args - Mutation arguments
   * @param {string} args.id - Order's ID
   * @param {string} args.status - New status
   * @param {Object} context - Request context
   * 
   * @example
   * // GraphQL Mutation:
   * // mutation {
   * //   updateOrderStatus(
   * //     id: "507f1f77bcf86cd799439012",
   * //     status: "shipped"
   * //   ) {
   * //     _id
   * //     status
   * //   }
   * // }
   * 
   * // Sample Output:
   * // {
   * //   "_id": "507f1f77bcf86cd799439012",
   * //   "status": "shipped"
   * // }
   * 
   * @returns {Promise<Object>} Updated order object
   */
  updateOrderStatus: async (args, context) => {
    const user = requireAuth(context);
    return await orderService.updateOrderStatus(args.id, args.status, user.userId);
  },

  /**
   * Cancel Order
   * 
   * @param {Object} args - Mutation arguments
   * @param {string} args.id - Order's ID
   * @param {Object} context - Request context
   * 
   * @example
   * // GraphQL Mutation:
   * // mutation {
   * //   cancelOrder(id: "507f1f77bcf86cd799439012") {
   * //     _id
   * //     status
   * //   }
   * // }
   * 
   * // Sample Output:
   * // {
   * //   "_id": "507f1f77bcf86cd799439012",
   * //   "status": "cancelled"
   * // }
   * 
   * @returns {Promise<Object>} Cancelled order object
   */
  cancelOrder: async (args, context) => {
    const user = requireAuth(context);
    return await orderService.cancelOrder(args.id, user.userId);
  },

  /**
   * Delete Order
   * 
   * @param {Object} args - Mutation arguments
   * @param {string} args.id - Order's ID
   * @param {Object} context - Request context
   * 
   * @example
   * // GraphQL Mutation:
   * // mutation {
   * //   deleteOrder(id: "507f1f77bcf86cd799439012") {
   * //     _id
   * //     status
   * //   }
   * // }
   * 
   * // Sample Output:
   * // {
   * //   "_id": "507f1f77bcf86cd799439012",
   * //   "status": "pending"
   * // }
   * 
   * @returns {Promise<Object>} Deleted order object
   */
  deleteOrder: async (args, context) => {
    requireAuth(context);
    return await orderService.deleteOrder(args.id);
  },
};

module.exports = resolvers;

// Made with Bob
