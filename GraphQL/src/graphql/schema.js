const { buildSchema } = require('graphql');

/**
 * GraphQL Schema
 * 
 * @description Defines the GraphQL type system and operations
 * Includes types, queries, and mutations for User and Order entities
 * 
 * Types:
 * - User: User account information
 * - AuthPayload: Authentication response with user and token
 * - Order: Order information with items and shipping details
 * - OrderItem: Individual item in an order
 * - ShippingAddress: Delivery address information
 * 
 * Queries:
 * - User queries: Get user by ID, get all users, get current user
 * - Order queries: Get order by ID, get user orders, get all orders, get orders by status
 * 
 * Mutations:
 * - User mutations: Register, login, update user, delete user
 * - Order mutations: Create order, update order status, cancel order, delete order
 */

const schema = buildSchema(`
  """
  User type representing a registered user
  """
  type User {
    _id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  """
  Authentication payload returned after login/register
  Contains user information and JWT token
  """
  type AuthPayload {
    user: User!
    token: String!
  }

  """
  Order item representing a product in an order
  """
  type OrderItem {
    productName: String!
    quantity: Int!
    price: Float!
  }

  """
  Shipping address for order delivery
  """
  type ShippingAddress {
    street: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
  }

  """
  Order type representing a customer order
  """
  type Order {
    _id: ID!
    user: User!
    items: [OrderItem!]!
    totalAmount: Float!
    status: String!
    shippingAddress: ShippingAddress!
    createdAt: String!
    updatedAt: String!
  }

  """
  Input type for order items
  """
  input OrderItemInput {
    productName: String!
    quantity: Int!
    price: Float!
  }

  """
  Input type for shipping address
  """
  input ShippingAddressInput {
    street: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
  }

  """
  Root Query type - Read operations
  """
  type Query {
    # User Queries
    """
    Get user by ID
    Requires authentication
    """
    user(id: ID!): User

    """
    Get all users with pagination
    Requires authentication
    """
    users(limit: Int, skip: Int): [User!]!

    """
    Get currently authenticated user
    Requires authentication
    """
    me: User

    # Order Queries
    """
    Get order by ID
    Requires authentication - users can only view their own orders
    """
    order(id: ID!): Order

    """
    Get all orders for the authenticated user
    Requires authentication
    """
    myOrders(limit: Int, skip: Int): [Order!]!

    """
    Get all orders (admin function)
    Requires authentication
    """
    orders(limit: Int, skip: Int): [Order!]!

    """
    Get orders filtered by status
    Requires authentication
    """
    ordersByStatus(status: String!, limit: Int, skip: Int): [Order!]!
  }

  """
  Root Mutation type - Write operations
  """
  type Mutation {
    # User Mutations
    """
    Register a new user account
    Returns user information and JWT token
    
    Example input:
    {
      name: "John Doe",
      email: "john@example.com",
      password: "password123"
    }
    """
    register(name: String!, email: String!, password: String!): AuthPayload!

    """
    Login with email and password
    Returns user information and JWT token
    
    Example input:
    {
      email: "john@example.com",
      password: "password123"
    }
    """
    login(email: String!, password: String!): AuthPayload!

    """
    Update user information
    Requires authentication - users can only update their own profile
    
    Example input:
    {
      id: "507f1f77bcf86cd799439011",
      name: "Jane Doe"
    }
    """
    updateUser(id: ID!, name: String, email: String): User!

    """
    Delete user account
    Requires authentication - users can only delete their own account
    """
    deleteUser(id: ID!): User!

    # Order Mutations
    """
    Create a new order
    Requires authentication
    
    Example input:
    {
      items: [
        { productName: "Laptop", quantity: 1, price: 999.99 },
        { productName: "Mouse", quantity: 2, price: 25.50 }
      ],
      shippingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      }
    }
    """
    createOrder(items: [OrderItemInput!]!, shippingAddress: ShippingAddressInput!): Order!

    """
    Update order status
    Requires authentication - users can only update their own orders
    Valid statuses: pending, processing, shipped, delivered, cancelled
    
    Example input:
    {
      id: "507f1f77bcf86cd799439012",
      status: "shipped"
    }
    """
    updateOrderStatus(id: ID!, status: String!): Order!

    """
    Cancel an order
    Requires authentication - users can only cancel their own orders
    Cannot cancel orders that are already shipped or delivered
    """
    cancelOrder(id: ID!): Order!

    """
    Delete an order (admin function)
    Requires authentication
    """
    deleteOrder(id: ID!): Order!
  }
`);

module.exports = schema;

// Made with Bob
