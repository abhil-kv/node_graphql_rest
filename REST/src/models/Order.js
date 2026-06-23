const mongoose = require('mongoose');

/**
 * Order Schema
 * 
 * @description Mongoose schema for Order collection
 * Defines the structure and validation rules for order documents
 * 
 * Fields:
 * - user: Reference to User who created the order (required)
 * - items: Array of order items with product name, quantity, and price
 * - totalAmount: Total order amount (required)
 * - status: Order status (pending, processing, shipped, delivered, cancelled)
 * - shippingAddress: Delivery address details
 * - createdAt: Timestamp of order creation
 * - updatedAt: Timestamp of last update
 * 
 * @example
 * // Sample Document:
 * // {
 * //   _id: "507f1f77bcf86cd799439012",
 * //   user: "507f1f77bcf86cd799439011",
 * //   items: [
 * //     { productName: "Laptop", quantity: 1, price: 999.99 },
 * //     { productName: "Mouse", quantity: 2, price: 25.50 }
 * //   ],
 * //   totalAmount: 1050.99,
 * //   status: "pending",
 * //   shippingAddress: {
 * //     street: "123 Main St",
 * //     city: "New York",
 * //     state: "NY",
 * //     zipCode: "10001",
 * //     country: "USA"
 * //   },
 * //   createdAt: "2024-01-15T10:30:00.000Z",
 * //   updatedAt: "2024-01-15T10:30:00.000Z"
 * // }
 */
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    items: [
      {
        productName: {
          type: String,
          required: [true, 'Product name is required'],
          trim: true,
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
          min: [1, 'Quantity must be at least 1'],
        },
        price: {
          type: Number,
          required: [true, 'Price is required'],
          min: [0, 'Price cannot be negative'],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: {
      street: {
        type: String,
        required: [true, 'Street address is required'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
      },
      zipCode: {
        type: String,
        required: [true, 'Zip code is required'],
        trim: true,
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

/**
 * Pre-save Hook - Calculate Total Amount
 * 
 * @description Automatically calculates total amount from items before saving
 * 
 * @example
 * // Before save (if totalAmount not provided):
 * // items = [
 * //   { productName: "Laptop", quantity: 1, price: 999.99 },
 * //   { productName: "Mouse", quantity: 2, price: 25.50 }
 * // ]
 * 
 * // After save:
 * // totalAmount = 1050.99 (999.99 + 2 * 25.50)
 */
orderSchema.pre('save', function (next) {
  // Calculate total if not provided
  if (this.items && this.items.length > 0 && !this.totalAmount) {
    this.totalAmount = this.items.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);
  }
  next();
});

/**
 * To JSON Method
 * 
 * @description Removes internal fields when converting to JSON
 * @returns {Object} Order object without __v field
 * 
 * @example
 * // Sample Output:
 * // {
 * //   _id: "507f1f77bcf86cd799439012",
 * //   user: "507f1f77bcf86cd799439011",
 * //   items: [...],
 * //   totalAmount: 1050.99,
 * //   status: "pending",
 * //   shippingAddress: {...},
 * //   createdAt: "2024-01-15T10:30:00.000Z",
 * //   updatedAt: "2024-01-15T10:30:00.000Z"
 * // }
 */
orderSchema.methods.toJSON = function () {
  const order = this.toObject();
  delete order.__v;
  return order;
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

// Made with Bob
