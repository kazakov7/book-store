import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema(
  {
    itemQuantity: {
      type: Number,
      required: true,
      min: 1,
    },

    itemPrice: {
      type: Number,
      required: true,
    },

    orderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Order",
    },

    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Book",
    },
    userRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "orderItems",
  },
);

export default mongoose.model("OrderItem", orderItemSchema);
