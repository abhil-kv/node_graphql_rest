# GraphQL Folder

## Purpose
This folder contains GraphQL schema definitions and resolver functions that define the API structure and handle client requests. GraphQL provides a flexible, type-safe API layer for querying and mutating data.

## Architecture
GraphQL Layer Flow:
1. Client sends GraphQL query/mutation
2. GraphQL validates against schema
3. Resolver function is called
4. Resolver calls service layer
5. Service handles business logic
6. Repository accesses database
7. Response flows back to client

## Files

### schema.js
**Purpose:** Defines the GraphQL type system, queries, and mutations.

**What it does:**
- Defines all GraphQL types (User, Order, etc.)
- Specifies available queries (read operations)
- Specifies available mutations (write operations)
- Provides input types for complex arguments
- Documents API with descriptions

**Types Defined:**

#### User Type
Represents a registered user account.
```graphql
type User {
  _id: ID!
  name: String!
  email: String!
  createdAt: String!
  updatedAt: String!
}
```

#### AuthPayload Type
Returned after successful login/registration.
```graphql
type AuthPayload {
  user: User!
  token: String!
}
```

#### Order Type
Represents a customer order.
```graphql
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
```

#### OrderItem Type
Represents a product in an order.
```graphql
type OrderItem {
  productName: String!
  quantity: Int!
  price: Float!
}
```

#### ShippingAddress Type
Delivery address information.
```graphql
type ShippingAddress {
  street: String!
  city: String!
  state: String!
  zipCode: String!
  country: String!
}
```

**Input Types:**

#### OrderItemInput
```graphql
input OrderItemInput {
  productName: String!
  quantity: Int!
  price: Float!
}
```

#### ShippingAddressInput
```graphql
input ShippingAddressInput {
  street: String!
  city: String!
  state: String!
  zipCode: String!
  country: String!
}
```

**Queries (Read Operations):**

```graphql
type Query {
  # User Queries
  user(id: ID!): User
  users(limit: Int, skip: Int): [User!]!
  me: User

  # Order Queries
  order(id: ID!): Order
  myOrders(limit: Int, skip: Int): [Order!]!
  orders(limit: Int, skip: Int): [Order!]!
  ordersByStatus(status: String!, limit: Int, skip: Int): [Order!]!
}
```

**Mutations (Write Operations):**

```graphql
type Mutation {
  # User Mutations
  register(name: String!, email: String!, password: String!): AuthPayload!
  login(email: String!, password: String!): AuthPayload!
  updateUser(id: ID!, name: String, email: String): User!
  deleteUser(id: ID!): User!

  # Order Mutations
  createOrder(items: [OrderItemInput!]!, shippingAddress: ShippingAddressInput!): Order!
  updateOrderStatus(id: ID!, status: String!): Order!
  cancelOrder(id: ID!): Order!
  deleteOrder(id: ID!): Order!
}
```

---

### resolvers.js
**Purpose:** Implements resolver functions that handle GraphQL operations.

**What it does:**
- Handles all GraphQL queries and mutations
- Validates authentication and authorization
- Calls service layer for business logic
- Formats responses for GraphQL
- Handles errors appropriately

**Query Resolvers:**

#### `user(args, context)`
Get user by ID (requires authentication).

**Sample GraphQL Query:**
```graphql
query {
  user(id: "507f1f77bcf86cd799439011") {
    _id
    name
    email
  }
}
```

**Sample Response:**
```json
{
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

#### `users(args, context)`
Get all users with pagination (requires authentication).

**Sample GraphQL Query:**
```graphql
query {
  users(limit: 5, skip: 0) {
    _id
    name
    email
  }
}
```

**Sample Response:**
```json
{
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      }
    ]
  }
}
```

---

#### `me(args, context)`
Get current authenticated user.

**Sample GraphQL Query:**
```graphql
query {
  me {
    _id
    name
    email
  }
}
```

**Sample Response:**
```json
{
  "data": {
    "me": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

#### `order(args, context)`
Get order by ID (requires authentication, user must own order).

**Sample GraphQL Query:**
```graphql
query {
  order(id: "507f1f77bcf86cd799439012") {
    _id
    totalAmount
    status
    items {
      productName
      quantity
      price
    }
  }
}
```

**Sample Response:**
```json
{
  "data": {
    "order": {
      "_id": "507f1f77bcf86cd799439012",
      "totalAmount": 999.99,
      "status": "pending",
      "items": [
        {
          "productName": "Laptop",
          "quantity": 1,
          "price": 999.99
        }
      ]
    }
  }
}
```

---

#### `myOrders(args, context)`
Get current user's orders (requires authentication).

**Sample GraphQL Query:**
```graphql
query {
  myOrders(limit: 10) {
    _id
    totalAmount
    status
    createdAt
  }
}
```

---

#### `orders(args, context)`
Get all orders (requires authentication, admin function).

**Sample GraphQL Query:**
```graphql
query {
  orders(limit: 10) {
    _id
    user {
      name
      email
    }
    totalAmount
    status
  }
}
```

---

#### `ordersByStatus(args, context)`
Get orders filtered by status (requires authentication).

**Sample GraphQL Query:**
```graphql
query {
  ordersByStatus(status: "pending") {
    _id
    totalAmount
    status
  }
}
```

---

**Mutation Resolvers:**

#### `register(args, context)`
Register a new user account.

**Sample GraphQL Mutation:**
```graphql
mutation {
  register(
    name: "John Doe",
    email: "john@example.com",
    password: "password123"
  ) {
    user {
      _id
      name
      email
    }
    token
  }
}
```

**Sample Response:**
```json
{
  "data": {
    "register": {
      "user": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

---

#### `login(args, context)`
Login with email and password.

**Sample GraphQL Mutation:**
```graphql
mutation {
  login(
    email: "john@example.com",
    password: "password123"
  ) {
    user {
      _id
      name
      email
    }
    token
  }
}
```

**Sample Response:**
```json
{
  "data": {
    "login": {
      "user": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

---

#### `updateUser(args, context)`
Update user information (requires authentication).

**Sample GraphQL Mutation:**
```graphql
mutation {
  updateUser(
    id: "507f1f77bcf86cd799439011",
    name: "Jane Doe"
  ) {
    _id
    name
    email
  }
}
```

---

#### `deleteUser(args, context)`
Delete user account (requires authentication).

**Sample GraphQL Mutation:**
```graphql
mutation {
  deleteUser(id: "507f1f77bcf86cd799439011") {
    _id
    name
    email
  }
}
```

---

#### `createOrder(args, context)`
Create a new order (requires authentication).

**Sample GraphQL Mutation:**
```graphql
mutation {
  createOrder(
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
  ) {
    _id
    totalAmount
    status
    items {
      productName
      quantity
      price
    }
  }
}
```

**Sample Response:**
```json
{
  "data": {
    "createOrder": {
      "_id": "507f1f77bcf86cd799439012",
      "totalAmount": 1050.99,
      "status": "pending",
      "items": [
        {
          "productName": "Laptop",
          "quantity": 1,
          "price": 999.99
        },
        {
          "productName": "Mouse",
          "quantity": 2,
          "price": 25.50
        }
      ]
    }
  }
}
```

---

#### `updateOrderStatus(args, context)`
Update order status (requires authentication).

**Sample GraphQL Mutation:**
```graphql
mutation {
  updateOrderStatus(
    id: "507f1f77bcf86cd799439012",
    status: "shipped"
  ) {
    _id
    status
    updatedAt
  }
}
```

---

#### `cancelOrder(args, context)`
Cancel an order (requires authentication).

**Sample GraphQL Mutation:**
```graphql
mutation {
  cancelOrder(id: "507f1f77bcf86cd799439012") {
    _id
    status
  }
}
```

---

#### `deleteOrder(args, context)`
Delete an order (requires authentication, admin function).

**Sample GraphQL Mutation:**
```graphql
mutation {
  deleteOrder(id: "507f1f77bcf86cd799439012") {
    _id
    status
  }
}
```

## Authentication

All queries and mutations (except register and login) require authentication via JWT token.

**How to authenticate:**
1. Register or login to get JWT token
2. Include token in Authorization header:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

**Example with curl:**
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"query": "query { me { _id name email } }"}'
```

## Error Handling

GraphQL errors are returned in standardized format:

```json
{
  "errors": [
    {
      "message": "Authentication required. Please login.",
      "locations": [{"line": 2, "column": 3}],
      "path": ["me"]
    }
  ]
}
```

Common error messages:
- "Authentication required. Please login."
- "User not found"
- "Invalid email or password"
- "Unauthorized: You can only update your own profile"
- "Order must contain at least one item"
- "Cannot cancel order that has been shipped or delivered"

## Testing with GraphiQL

In development mode, access GraphiQL interface at:
```
http://localhost:4000/graphql
```

GraphiQL provides:
- Interactive query editor
- Auto-completion
- Schema documentation
- Query history
- Variable support

## Best Practices

1. **Always validate authentication** before accessing protected resources
2. **Use descriptive error messages** for better debugging
3. **Keep resolvers thin** - delegate to service layer
4. **Document schema** with descriptions
5. **Use input types** for complex arguments
6. **Handle errors gracefully** in resolvers
7. **Test queries and mutations** thoroughly

## Dependencies
- graphql: GraphQL implementation
- userService: User business logic
- orderService: Order business logic
- auth middleware: Authentication helpers