import { ObjectId, Types } from "mongoose";
import { OrderStatus, PaymentStatus } from "../enums/order.enums";
import { Book } from "./product.type";

export interface CreateOrderInput {
  deliveryAddress: string;
  phoneNumber: string;
  items: OrderItemInput[];
}
export interface OrderItem {
  _id: Types.ObjectId;
  itemQuantity: number;
  itemPrice: number;
  orderId: Types.ObjectId;
  productId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
export interface Order {
  _id: Types.ObjectId;
  orderTotal: number;
  deliveryFee: number;
  orderStatus: OrderStatus;
  memberId: Types.ObjectId;
  paymentStatus: PaymentStatus;
  deliveryAddress: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  orderItems?: OrderItem[];
  productData?: Book[];
}
export interface OrderInquiry {
  page: number;
  limit: number;
  orderStatus: OrderStatus;
}
export interface OrderItemInput {
  itemQuantity: number;
  itemPrice: number;
  productId: Types.ObjectId;
  orderId?: Types.ObjectId;
  deliveryAddress: string;
}
export interface OrderUpdateInput {
  orderId: string;
  orderStatus: OrderStatus;
}
