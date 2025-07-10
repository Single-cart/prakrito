import mongoose, { Schema, model } from "mongoose";

export const orderSchema = new Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "Shipping address is required"],
      },
      fullName: {
        type: String,
        required: [true, "Full name is required"],
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
      },
      email: {
        type: String,
      },
    },

    orderItems: [
      {
        productName: {
          type: String,
          required: false, // Make optional to avoid breaking existing orders
        },
        image: {
          type: String,
          required: false, // Make optional to avoid breaking existing orders
        },
        quantity: {
          type: Number,
          required: [true, "Product quantity is required"],
        },
        price: {
          type: Number,
          required: [true, "Product price is required"],
        },
        priceVariationIndex: {
          type: Number,
          required: [true, "Price variation index is required"],
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },
      },
    ],

    orderNots: {
      type: String,
    },

    user: {
      type: String,
      ref: "User",
    },

    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    orderId: {
      type: String,
      required: [true, "OrderId is required"],
    },

    paymentType: {
      type: String,
      required: [true, "Payment Type is required"],
    },

    itemsPrice: {
      type: Number,
      required: [true, "Items price is required"],
    },
    shippingPrice: {
      type: Number,
      required: [true, "Shipping price is required"],
    },

    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
    },

    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = model("Order", orderSchema);

// Optimize for status-based queries
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, deliveredAt: 1 });

// Optimize for date-based queries
orderSchema.index({ createdAt: 1 });
orderSchema.index({ deliveredAt: 1 });

// Optimize for payment analysis
orderSchema.index({ paymentType: 1, totalAmount: 1 });

// Compound index for date range + status queries
orderSchema.index({ orderStatus: 1, createdAt: 1, deliveredAt: 1 });

export default OrderModel;
