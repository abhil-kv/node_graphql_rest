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
  type User {
    _id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type OrderItem {
    productName: String!
    quantity: Int!
    price: Float!
  }

  type ShippingAddress {
    street: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
  }

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

  input OrderItemInput {
    productName: String!
    quantity: Int!
    price: Float!
  }

  input ShippingAddressInput {
    street: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
  }

  type Query {
    user(id: ID!): User
    users(limit: Int, skip: Int): [User!]!
    me: User
    order(id: ID!): Order
    myOrders(limit: Int, skip: Int): [Order!]!
    orders(limit: Int, skip: Int): [Order!]!
    ordersByStatus(status: String!, limit: Int, skip: Int): [Order!]!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateUser(id: ID!, name: String, email: String): User!
    deleteUser(id: ID!): User!
    createOrder(items: [OrderItemInput!]!, shippingAddress: ShippingAddressInput!): Order!
    updateOrderStatus(id: ID!, status: String!): Order!
    cancelOrder(id: ID!): Order!
    deleteOrder(id: ID!): Order!
  }
`);

module.exports = schema;

// Order! => order type is return type and ! means it wont be null 
// [Order!]! => array of  Orders (not null) type, and the array is not null
/**
 * SCHEMA DOCUMENTATION
 * ====================
 *
 * TYPES:
 * ------
 *
 * User:
 * - User type representing a registered user
 * - Fields: _id, name, email, createdAt, updatedAt
 *
 * AuthPayload:
 * - Authentication payload returned after login/register
 * - Contains user information and JWT token
 * - Fields: user (User), token (String)
 *
 * OrderItem:
 * - Order item representing a product in an order
 * - Fields: productName, quantity, price
 *
 * ShippingAddress:
 * - Shipping address for order delivery
 * - Fields: street, city, state, zipCode, country
 *
 * Order:
 * - Order type representing a customer order
 * - Fields: _id, user, items, totalAmount, status, shippingAddress, createdAt, updatedAt
 *
 * OrderItemInput:
 * - Input type for order items
 * - Fields: productName, quantity, price
 *
 * ShippingAddressInput:
 * - Input type for shipping address
 * - Fields: street, city, state, zipCode, country
 *
 *
 * QUERIES:
 * --------
 *
 * User Queries:
 *
 * 1. user(id: ID!): User
 *    - Get user by ID
 *    - Requires authentication
 *    - Example:
 *      query {
 *        user(id: "507f1f77bcf86cd799439011") {
 *          _id
 *          name
 *          email
 *          createdAt
 *          updatedAt
 *        }
 *      }
 *
 * 2. users(limit: Int, skip: Int): [User!]!
 *    - Get all users with pagination
 *    - Requires authentication
 *    - Example:
 *      query {
 *        users(limit: 10, skip: 0) {
 *          _id
 *          name
 *          email
 *          createdAt
 *        }
 *      }
 *
 * 3. me: User
 *    - Get currently authenticated user
 *    - Requires authentication
 *    - Example:
 *      query {
 *        me {
 *          _id
 *          name
 *          email
 *          createdAt
 *          updatedAt
 *        }
 *      }
 *
 * Order Queries:
 *
 * 4. order(id: ID!): Order
 *    - Get order by ID
 *    - Requires authentication - users can only view their own orders
 *    - Example:
 *      query {
 *        order(id: "507f1f77bcf86cd799439012") {
 *          _id
 *          user {
 *            _id
 *            name
 *            email
 *          }
 *          items {
 *            productName
 *            quantity
 *            price
 *          }
 *          totalAmount
 *          status
 *          shippingAddress {
 *            street
 *            city
 *            state
 *            zipCode
 *            country
 *          }
 *          createdAt
 *          updatedAt
 *        }
 *      }
 *
 * 5. myOrders(limit: Int, skip: Int): [Order!]!
 *    - Get all orders for the authenticated user
 *    - Requires authentication
 *    - Example:
 *      query {
 *        myOrders(limit: 5, skip: 0) {
 *          _id
 *          items {
 *            productName
 *            quantity
 *            price
 *          }
 *          totalAmount
 *          status
 *          createdAt
 *        }
 *      }
 *
 * 6. orders(limit: Int, skip: Int): [Order!]!
 *    - Get all orders (admin function)
 *    - Requires authentication
 *    - Example:
 *      query {
 *        orders(limit: 20, skip: 0) {
 *          _id
 *          user {
 *            _id
 *            name
 *            email
 *          }
 *          totalAmount
 *          status
 *          createdAt
 *        }
 *      }
 *
 * 7. ordersByStatus(status: String!, limit: Int, skip: Int): [Order!]!
 *    - Get orders filtered by status
 *    - Requires authentication
 *    - Example:
 *      query {
 *        ordersByStatus(status: "pending", limit: 10, skip: 0) {
 *          _id
 *          user {
 *            name
 *            email
 *          }
 *          totalAmount
 *          status
 *          createdAt
 *        }
 *      }
 *
 *
 * MUTATIONS:
 * ----------
 *
 * User Mutations:
 *
 * 1. register(name: String!, email: String!, password: String!): AuthPayload!
 *    - Register a new user account
 *    - Returns user information and JWT token
 *    - Example:
 *      mutation {
 *        register(
 *          name: "John Doe"
 *          email: "john@example.com"
 *          password: "password123"
 *        ) {
 *          user {
 *            _id
 *            name
 *            email
 *            createdAt
 *          }
 *          token
 *        }
 *      }
 *
 * 2. login(email: String!, password: String!): AuthPayload!
 *    - Login with email and password
 *    - Returns user information and JWT token
 *    - Example:
 *      mutation {
 *        login(
 *          email: "john@example.com"
 *          password: "password123"
 *        ) {
 *          user {
 *            _id
 *            name
 *            email
 *          }
 *          token
 *        }
 *      }
 *
 * 3. updateUser(id: ID!, name: String, email: String): User!
 *    - Update user information
 *    - Requires authentication - users can only update their own profile
 *    - Example:
 *      mutation {
 *        updateUser(
 *          id: "507f1f77bcf86cd799439011"
 *          name: "Jane Doe"
 *          email: "jane@example.com"
 *        ) {
 *          _id
 *          name
 *          email
 *          updatedAt
 *        }
 *      }
 *
 * 4. deleteUser(id: ID!): User!
 *    - Delete user account
 *    - Requires authentication - users can only delete their own account
 *    - Example:
 *      mutation {
 *        deleteUser(id: "507f1f77bcf86cd799439011") {
 *          _id
 *          name
 *          email
 *        }
 *      }
 *
 * Order Mutations:
 *
 * 5. createOrder(items: [OrderItemInput!]!, shippingAddress: ShippingAddressInput!): Order!
 *    - Create a new order
 *    - Requires authentication
 *    - Example:
 *      mutation {
 *        createOrder(
 *          items: [
 *            { productName: "Laptop", quantity: 1, price: 999.99 }
 *            { productName: "Mouse", quantity: 2, price: 25.50 }
 *          ]
 *          shippingAddress: {
 *            street: "123 Main St"
 *            city: "New York"
 *            state: "NY"
 *            zipCode: "10001"
 *            country: "USA"
 *          }
 *        ) {
 *          _id
 *          user {
 *            _id
 *            name
 *          }
 *          items {
 *            productName
 *            quantity
 *            price
 *          }
 *          totalAmount
 *          status
 *          shippingAddress {
 *            street
 *            city
 *            state
 *            zipCode
 *            country
 *          }
 *          createdAt
 *        }
 *      }
 *
 * 6. updateOrderStatus(id: ID!, status: String!): Order!
 *    - Update order status
 *    - Requires authentication - users can only update their own orders
 *    - Valid statuses: pending, processing, shipped, delivered, cancelled
 *    - Example:
 *      mutation {
 *        updateOrderStatus(
 *          id: "507f1f77bcf86cd799439012"
 *          status: "shipped"
 *        ) {
 *          _id
 *          status
 *          updatedAt
 *        }
 *      }
 *
 * 7. cancelOrder(id: ID!): Order!
 *    - Cancel an order
 *    - Requires authentication - users can only cancel their own orders
 *    - Cannot cancel orders that are already shipped or delivered
 *    - Example:
 *      mutation {
 *        cancelOrder(id: "507f1f77bcf86cd799439012") {
 *          _id
 *          status
 *          updatedAt
 *        }
 *      }
 *
 * 8. deleteOrder(id: ID!): Order!
 *    - Delete an order (admin function)
 *    - Requires authentication
 *    - Example:
 *      mutation {
 *        deleteOrder(id: "507f1f77bcf86cd799439012") {
 *          _id
 *          status
 *        }
 *      }
 */

// Made with Bob
