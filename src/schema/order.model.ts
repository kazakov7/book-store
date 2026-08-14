import mongoose, { Schema } from "mongoose";
import { OrderStatus, PaymentStatus } from "../libs/enums/order.enums";

const orderSchema = new Schema(
  {
    memberId: {
      //ok
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Member",
    },

    orderTotal: {
      //ok
      type: Number,
      required: true,
    },

    deliveryFee: {
      type: Number, //ok
      default: 0,
      required: true,
    },

    paymentStatus: {
      //ok
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },

    orderStatus: {
      //ok
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },

    deliveryAddress: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Order", orderSchema);
