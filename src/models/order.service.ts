import { Types } from "mongoose";
import { OrderStatus, PaymentStatus } from "../libs/enums/order.enums";
import { BookStatus } from "../libs/enums/product.enum";
import { Member } from "../libs/types/user.type";
import Errors, { HttpCode, Message } from "../libs/utils/errors";

import UserService from "./user.service";
import { strToObjectId } from "../libs/utils/config";
import {
  CreateOrderInput,
  Order,
  OrderInquiry,
  OrderItemInput,
  OrderUpdateInput,
} from "../libs/types/order";
import orderModel from "../schema/order.model";
import orderItemModel from "../schema/order.item.model";
import ProductService from "./product.service";
import productModels from "../schema/product.models";

class OrderService {
  private readonly orderModel;
  private readonly orderItemModel;
  private readonly productModel;

  constructor() {
    this.orderModel = orderModel;
    this.orderItemModel = orderItemModel;
    this.productModel = productModels;
  }
  public async createOrder(
    member: Member,
    input: CreateOrderInput,
  ): Promise<Order> {
    const memberId = strToObjectId(member._id);

    if (!input.items || input.items.length === 0) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.WRONG_INPUT);
    }

    let amount = 0;
    for (const item of input.items) {
      const productId = strToObjectId(item.productId);
      const book = await this.productModel.findById(productId).exec();

      if (
        !book ||
        book.status !== BookStatus.ACTIVE ||
        item.itemQuantity <= 0 ||
        book.stock < item.itemQuantity
      ) {
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATED_FAILED);
      }

      item.itemPrice = book.price;
      amount += book.price * item.itemQuantity;
    }

    const delivery = amount < 100 ? 5 : 0;

    try {
      const newOrder: Order = await this.orderModel.create({
        memberId: memberId,
        orderTotal: amount + delivery,
        deliveryFee: delivery,
        deliveryAddress: input.deliveryAddress,
        phoneNumber: input.phoneNumber,
        paymentStatus: PaymentStatus.PAID,
      });

      const orderId = newOrder._id;
      console.log("orderId", orderId);
      await this.recordOrderItem(orderId, input.items);

      await Promise.all(
        input.items.map(async (item) => {
          const updatedBook = await this.productModel.findOneAndUpdate(
            { _id: strToObjectId(item.productId) },
            {
              $inc: {
                soldCount: item.itemQuantity,
                stock: -item.itemQuantity,
              },
            },
            { returnDocument: "after" },
          );

          if (updatedBook && updatedBook.stock <= 0) {
            await this.productModel.findByIdAndUpdate(updatedBook._id, {
              status: BookStatus.OUT_OF_STOCK,
            });
          }
        }),
      );

      return newOrder;
    } catch (err) {
      console.log("Error,model:createOrder", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATED_FAILED);
    }
  }
  private async recordOrderItem(
    orderId: Types.ObjectId,
    input: OrderItemInput[],
  ): Promise<void> {
    console.log("dddd", input);
    const promisedList = input.map(async (item: OrderItemInput) => {
      item.orderId = orderId;
      item.productId = strToObjectId(item.productId);
      await this.orderItemModel.create(item);
      return "Inserted";
    });
    const orderItemsState = await Promise.all(promisedList);
  }

  public async getMyOrders(member: Member): Promise<Order[]> {
    const memberid = strToObjectId(member._id);
    const result = await this.orderModel.aggregate([
      { $match: { memberId: memberid } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "orderItems",
          localField: "_id",
          foreignField: "orderId",
          as: "orderItems",
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "orderItems.productId",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $lookup: {
          from: "members",
          localField: "memberId",
          foreignField: "_id",
          as: "memberdata",
        },
      },
      {
        $project: {
          "memberdata.memberPassword": 0,
        },
      },
    ]);
    console.log(result);

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result as unknown as Order[];
  }

  public async updateOrder(
    member: Member,
    input: OrderUpdateInput,
  ): Promise<Order> {
    const memberId = strToObjectId(member._id),
      orderId = strToObjectId(input.orderId),
      orderStatus = input.orderStatus;

    const result = await this.orderModel.findOneAndUpdate(
      { memberId: memberId, _id: orderId },
      { orderStatus: orderStatus },
      { returnDocument: "after" },
    );
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result as unknown as Order;
  }
}
export default OrderService;
