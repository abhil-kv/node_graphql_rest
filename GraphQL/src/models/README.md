# Models Folder

## Purpose
This folder contains Mongoose schemas and models that define the structure of MongoDB documents. Models represent the data layer and include validation rules, default values, and instance methods.

## Files

### User.js
**Purpose:** Defines the User schema and model for user accounts.

**What it does:**
- Defines user document structure (name, email, password)
- Validates user data before saving
- Automatically hashes passwords before storage
- Provides password comparison method
- Removes sensitive data from JSON responses

**Schema Fields:**
- `name`: String (required, trimmed)
- `email`: String (required, unique, lowercase, validated)
- `password`: String (required, min 6 chars, hashed, not returned by default)
- `createdAt`: Date (auto-generated)
- `updatedAt`: Date (auto-generated)

**Sample Document:**
```javascript
{
  _id: "507f1f77bcf86cd799439011",
  name: "John Doe",
  email: "john@example.com",
  password: "$2a$10$...", // hashed
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-15T10:30:00.000Z"
}
```

**Methods:**

#### `user.comparePassword(candidatePassword)`
Compares plain text password with hashed password.

**Sample Input:**
```javascript
const isMatch = await user.comparePassword("mypassword123");
```

**Sample Output:**
```javascript
true // if password matches
false // if password doesn't match
```

#### `user.toJSON()`
Removes sensitive fields when converting to JSON.

**Sample Output:**
```javascript
{
  _id: "507f1f77bcf86cd799439011",
  name: "John Doe",
  email: "john@example.com",
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-15T10:30:00.000Z"
  // password field removed
}
```

**Hooks:**
- `pre('save')`: Automatically hashes password before saving (only if modified)

---

### Order.js
**Purpose:** Defines the Order schema and model for customer orders.

**What it does:**
- Defines order document structure with items and shipping info
- Validates order data and relationships
- Automatically calculates total amount
- References User model for order ownership
- Manages order status lifecycle

**Schema Fields:**
- `user`: ObjectId (required, references User)
- `items`: Array of OrderItem objects (required)
  - `productName`: String (required)
  - `quantity`: Number (required, min 1)
  - `price`: Number (required, min 0)
- `totalAmount`: Number (required, min 0, auto-calculated)
- `status`: String (enum: pending, processing, shipped, delivered, cancelled)
- `shippingAddress`: Object (required)
  - `street`: String (required)
  - `city`: String (required)
  - `state`: String (required)
  - `zipCode`: String (required)
  - `country`: String (required)
- `createdAt`: Date (auto-generated)
- `updatedAt`: Date (auto-generated)

**Sample Document:**
```javascript
{
  _id: "507f1f77bcf86cd799439012",
  user: "507f1f77bcf86cd799439011",
  items: [
    { productName: "Laptop", quantity: 1, price: 999.99 },
    { productName: "Mouse", quantity: 2, price: 25.50 }
  ],
  totalAmount: 1050.99,
  status: "pending",
  shippingAddress: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA"
  },
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-15T10:30:00.000Z"
}
```

**Methods:**

#### `order.toJSON()`
Removes internal fields when converting to JSON.

**Sample Output:**
```javascript
{
  _id: "507f1f77bcf86cd799439012",
  user: "507f1f77bcf86cd799439011",
  items: [...],
  totalAmount: 1050.99,
  status: "pending",
  shippingAddress: {...},
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-15T10:30:00.000Z"
  // __v field removed
}
```

**Hooks:**
- `pre('save')`: Automatically calculates totalAmount from items if not provided

## Usage Examples

### Creating a User
```javascript
const User = require('./models/User');

const user = new User({
  name: "John Doe",
  email: "john@example.com",
  password: "password123" // Will be hashed automatically
});

await user.save();
console.log(user.toJSON()); // Password not included
```

### Verifying Password
```javascript
const user = await User.findOne({ email: "john@example.com" }).select('+password');
const isValid = await user.comparePassword("password123");
if (isValid) {
  console.log("Password correct!");
}
```

### Creating an Order
```javascript
const Order = require('./models/Order');

const order = new Order({
  user: userId,
  items: [
    { productName: "Laptop", quantity: 1, price: 999.99 }
  ],
  shippingAddress: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA"
  }
  // totalAmount calculated automatically
});

await order.save();
```

### Populating User in Order
```javascript
const order = await Order.findById(orderId).populate('user', 'name email');
console.log(order.user.name); // Access populated user data
```

## Validation Rules

### User Model
- Email must be valid format
- Email must be unique
- Password minimum 6 characters
- Name is required

### Order Model
- At least one item required
- Quantity must be at least 1
- Price cannot be negative
- All shipping address fields required
- Status must be valid enum value

## Dependencies
- mongoose: MongoDB object modeling
- bcryptjs: Password hashing (User model)

## Best Practices
- Always use `select('+password')` when you need password field
- Use `populate()` to load referenced documents
- Leverage pre/post hooks for automatic data processing
- Keep sensitive data out of JSON responses
- Use validation at model level for data integrity