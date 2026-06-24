const userService = require('../services/userService');
const orderService = require('../services/orderService');
const { requireAuth } = require('../middleware/auth');

// we get context from graphqlHTTP set from server.js 

const resolvers = {
  user: async (args, context) => {
    requireAuth(context);
    return await userService.getUserById(args.id);
  },

  users: async (args, context) => {
    requireAuth(context);
    const limit = args.limit || 10;
    const skip = args.skip || 0;
    return await userService.getAllUsers(limit, skip);
  },

  me: async (args, context) => {
    const user = requireAuth(context);
    return await userService.getUserById(user.userId);
  },

  order: async (args, context) => {
    const user = requireAuth(context);
    return await orderService.getOrderById(args.id, user.userId);
  },

  myOrders: async (args, context) => {
    const user = requireAuth(context);
    const limit = args.limit || 10;
    const skip = args.skip || 0;
    return await orderService.getUserOrders(user.userId, limit, skip);
  },

  orders: async (args, context) => {
    requireAuth(context);
    const limit = args.limit || 10;
    const skip = args.skip || 0;
    return await orderService.getAllOrders(limit, skip);
  },

  ordersByStatus: async (args, context) => {
    requireAuth(context);
    const limit = args.limit || 10;
    const skip = args.skip || 0;
    return await orderService.getOrdersByStatus(args.status, limit, skip);
  },


  // Mutations 

  register: async (args) => {
    return await userService.register({
      name: args.name,
      email: args.email,
      password: args.password,
    });
  },

  login: async (args) => {
    return await userService.login(args.email, args.password);
  },

  updateUser: async (args, context) => {
    const user = requireAuth(context);
    const updateData = {};
    if (args.name) updateData.name = args.name;
    if (args.email) updateData.email = args.email;
    return await userService.updateUser(args.id, updateData, user.userId);
  },

  deleteUser: async (args, context) => {
    const user = requireAuth(context);
    return await userService.deleteUser(args.id, user.userId);
  },

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

  updateOrderStatus: async (args, context) => {
    const user = requireAuth(context);
    return await orderService.updateOrderStatus(args.id, args.status, user.userId);
  },

  cancelOrder: async (args, context) => {
    const user = requireAuth(context);
    return await orderService.cancelOrder(args.id, user.userId);
  },

  deleteOrder: async (args, context) => {
    requireAuth(context);
    return await orderService.deleteOrder(args.id);
  },
};

module.exports = resolvers;

/**
 * RESOLVER DOCUMENTATION
 * ======================
 *
 * GraphQL Resolvers handle queries and mutations by connecting GraphQL operations to service layer functions.
 * Each resolver receives (args, context) where:
 * - args: Input arguments from the GraphQL query/mutation
 * - context: Request context including user authentication info
 *
 *
 * QUERY RESOLVERS:
 * ----------------
 *
 * 1. user(args, context)
 *    Description: Get user by ID
 *    Authentication: Required
 *    Parameters:
 *      - args.id: User's ID
 *    Returns: User object
 *
 *    GraphQL Query:
 *    query {
 *      user(id: "507f1f77bcf86cd799439011") {
 *        _id
 *        name
 *        email
 *      }
 *    }
 *
 *    Sample Output:
 *    {
 *      "_id": "507f1f77bcf86cd799439011",
 *      "name": "John Doe",
 *      "email": "john@example.com"
 *    }
 *
 *
 * 2. users(args, context)
 *    Description: Get all users with pagination
 *    Authentication: Required
 *    Parameters:
 *      - args.limit: Maximum number of users (default: 10)
 *      - args.skip: Number of users to skip (default: 0)
 *    Returns: Array of user objects
 *
 *    GraphQL Query:
 *    query {
 *      users(limit: 5, skip: 0) {
 *        _id
 *        name
 *        email
 *      }
 *    }
 *
 *    Sample Output:
 *    [
 *      { "_id": "507f1f77bcf86cd799439011", "name": "John Doe", "email": "john@example.com" },
 *      { "_id": "507f1f77bcf86cd799439012", "name": "Jane Smith", "email": "jane@example.com" }
 *    ]
 *
 *
 * 3. me(args, context)
 *    Description: Get currently authenticated user
 *    Authentication: Required
 *    Parameters: None
 *    Returns: Current user object
 *
 *    GraphQL Query:
 *    query {
 *      me {
 *        _id
 *        name
 *        email
 *      }
 *    }
 *
 *    Sample Output:
 *    {
 *      "_id": "507f1f77bcf86cd799439011",
 *      "name": "John Doe",
 *      "email": "john@example.com"
 *    }
 *
 *
 * 4. order(args, context)
 *    Description: Get order by ID
 *    Authentication: Required - users can only view their own orders
 *    Parameters:
 *      - args.id: Order's ID
 *    Returns: Order object
 *
 *    GraphQL Query:
 *    query {
 *      order(id: "507f1f77bcf86cd799439012") {
 *        _id
 *        totalAmount
 *        status
 *        items {
 *          productName
 *          quantity
 *          price
 *        }
 *      }
 *    }
 *
 *    Sample Output:
 *    {
 *      "_id": "507f1f77bcf86cd799439012",
 *      "totalAmount": 1050.99,
 *      "status": "pending",
 *      "items": [
 *        { "productName": "Laptop", "quantity": 1, "price": 999.99 }
 *      ]
 *    }
 *
 *
 * 5. myOrders(args, context)
 *    Description: Get all orders for the authenticated user
 *    Authentication: Required
 *    Parameters:
 *      - args.limit: Maximum number of orders (default: 10)
 *      - args.skip: Number of orders to skip (default: 0)
 *    Returns: Array of order objects
 *
 *    GraphQL Query:
 *    query {
 *      myOrders(limit: 5) {
 *        _id
 *        totalAmount
 *        status
 *      }
 *    }
 *
 *    Sample Output:
 *    [
 *      { "_id": "507f1f77bcf86cd799439012", "totalAmount": 1050.99, "status": "pending" },
 *      { "_id": "507f1f77bcf86cd799439013", "totalAmount": 250.50, "status": "shipped" }
 *    ]
 *
 *
 * 6. orders(args, context)
 *    Description: Get all orders (admin function)
 *    Authentication: Required
 *    Parameters:
 *      - args.limit: Maximum number of orders (default: 10)
 *      - args.skip: Number of orders to skip (default: 0)
 *    Returns: Array of order objects
 *
 *    GraphQL Query:
 *    query {
 *      orders(limit: 10) {
 *        _id
 *        user {
 *          name
 *          email
 *        }
 *        totalAmount
 *        status
 *      }
 *    }
 *
 *    Sample Output:
 *    [
 *      {
 *        "_id": "507f1f77bcf86cd799439012",
 *        "user": { "name": "John Doe", "email": "john@example.com" },
 *        "totalAmount": 1050.99,
 *        "status": "pending"
 *      }
 *    ]
 *
 *
 * 7. ordersByStatus(args, context)
 *    Description: Get orders filtered by status
 *    Authentication: Required
 *    Parameters:
 *      - args.status: Order status to filter by
 *      - args.limit: Maximum number of orders (default: 10)
 *      - args.skip: Number of orders to skip (default: 0)
 *    Returns: Array of order objects
 *
 *    GraphQL Query:
 *    query {
 *      ordersByStatus(status: "pending") {
 *        _id
 *        totalAmount
 *        status
 *      }
 *    }
 *
 *    Sample Output:
 *    [
 *      { "_id": "507f1f77bcf86cd799439012", "totalAmount": 1050.99, "status": "pending" }
 *    ]
 *
 *
 * MUTATION RESOLVERS:
 * -------------------
 *
 * 1. register(args)
 *    Description: Register a new user account
 *    Authentication: Not required
 *    Parameters:
 *      - args.name: User's name
 *      - args.email: User's email
 *      - args.password: User's password
 *    Returns: AuthPayload with user and token
 *
 *    GraphQL Mutation:
 *    mutation {
 *      register(
 *        name: "John Doe",
 *        email: "john@example.com",
 *        password: "password123"
 *      ) {
 *        user {
 *          _id
 *          name
 *          email
 *        }
 *        token
 *      }
 *    }
 *
 *    Sample Output:
 *    {
 *      "user": {
 *        "_id": "507f1f77bcf86cd799439011",
 *        "name": "John Doe",
 *        "email": "john@example.com"
 *      },
 *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *    }
 *
 *
 * 2. login(args)
 *    Description: Login with email and password
 *    Authentication: Not required
 *    Parameters:
 *      - args.email: User's email
 *      - args.password: User's password
 *    Returns: AuthPayload with user and token
 *
 *    GraphQL Mutation:
 *    mutation {
 *      login(
 *        email: "john@example.com",
 *        password: "password123"
 *      ) {
 *        user {
 *          _id
 *          name
 *          email
 *        }
 *        token
 *      }
 *    }
 *
 *    Sample Output:
 *    {
 *      "user": {
 *        "_id": "507f1f77bcf86cd799439011",
 *        "name": "John Doe",
 *        "email": "john@example.com"
 *      },
 *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *    }
 *
 *
 * 3. updateUser(args, context)
 *    Description: Update user information
 *    Authentication: Required - users can only update their own profile
 *    Parameters:
 *      - args.id: User's ID
 *      - args.name: New name (optional)
 *      - args.email: New email (optional)
 *    Returns: Updated user object
 *
 *    GraphQL Mutation:
 *    mutation {
 *      updateUser(
 *        id: "507f1f77bcf86cd799439011",
 *        name: "Jane Doe"
 *      ) {
 *        _id
 *        name
 *        email
 *      }
 *    }
 *
 *    Sample Output:
 *    {
 *      "_id": "507f1f77bcf86cd799439011",
 *      "name": "Jane Doe",
 *      "email": "john@example.com"
 *    }
 *
 *
 * 4. deleteUser(args, context)
 *    Description: Delete user account
 *    Authentication: Required - users can only delete their own account
 *    Parameters:
 *      - args.id: User's ID
 *    Returns: Deleted user object
 *
 *    GraphQL Mutation:
 *    mutation {
 *      deleteUser(id: "507f1f77bcf86cd799439011") {
 *        _id
 *        name
 *        email
 *      }
 *    }
 *
 *    Sample Output:
 *    {
 *      "_id": "507f1f77bcf86cd799439011",
 *      "name": "John Doe",
 *      "email": "john@example.com"
 *    }
 *
 *
 * 5. createOrder(args, context)
 *    Description: Create a new order
 *    Authentication: Required
 *    Parameters:
 *      - args.items: Array of order items
 *      - args.shippingAddress: Shipping address object
 *    Returns: Created order object
 *
 *    GraphQL Mutation:
 *    mutation {
 *      createOrder(
 *        items: [
 *          { productName: "Laptop", quantity: 1, price: 999.99 }
 *        ],
 *        shippingAddress: {
 *          street: "123 Main St",
 *          city: "New York",
 *          state: "NY",
 *          zipCode: "10001",
 *          country: "USA"
 *        }
 *      ) {
 *        _id
 *        totalAmount
 *        status
 *      }
 *    }
 *
 *    Sample Output:
 *    {
 *      "_id": "507f1f77bcf86cd799439012",
 *      "totalAmount": 999.99,
 *      "status": "pending"
 *    }
 *
 *
 * 6. updateOrderStatus(args, context)
 *    Description: Update order status
 *    Authentication: Required - users can only update their own orders
 *    Parameters:
 *      - args.id: Order's ID
 *      - args.status: New status
 *    Returns: Updated order object
 *
 *    GraphQL Mutation:
 *    mutation {
 *      updateOrderStatus(
 *        id: "507f1f77bcf86cd799439012",
 *        status: "shipped"
 *      ) {
 *        _id
 *        status
 *      }
 *    }
 *
 *    Sample Output:
 *    {
 *      "_id": "507f1f77bcf86cd799439012",
 *      "status": "shipped"
 *    }
 *
 *
 * 7. cancelOrder(args, context)
 *    Description: Cancel an order
 *    Authentication: Required - users can only cancel their own orders
 *    Note: Cannot cancel orders that are already shipped or delivered
 *    Parameters:
 *      - args.id: Order's ID
 *    Returns: Cancelled order object
 *
 *    GraphQL Mutation:
 *    mutation {
 *      cancelOrder(id: "507f1f77bcf86cd799439012") {
 *        _id
 *        status
 *      }
 *    }
 *
 *    Sample Output:
 *    {
 *      "_id": "507f1f77bcf86cd799439012",
 *      "status": "cancelled"
 *    }
 *
 *
 * 8. deleteOrder(args, context)
 *    Description: Delete an order (admin function)
 *    Authentication: Required
 *    Parameters:
 *      - args.id: Order's ID
 *    Returns: Deleted order object
 *
 *    GraphQL Mutation:
 *    mutation {
 *      deleteOrder(id: "507f1f77bcf86cd799439012") {
 *        _id
 *        status
 *      }
 *    }
 *
 *    Sample Output:
 *    {
 *      "_id": "507f1f77bcf86cd799439012",
 *      "status": "pending"
 *    }
 */

// Made with Bob
