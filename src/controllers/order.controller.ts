import { T } from "../libs/types/common";
import { Response } from "express";
import { ExtendedRequest } from "../libs/types/user.type";
import OrderService from "../models/order.service";
import Errors, { HttpCode } from "../libs/utils/errors";
import { OrderInquiry, OrderUpdateInput } from "../libs/types/order";

const orderController: T = {};
const orderService = new OrderService();
orderController.createOrder = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("createOrder", req.body);

    const result = await orderService.createOrder(req.user, req.body);
    res.status(HttpCode.OK).json({ result });
  } catch (err) {
    console.log("Error getProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};
orderController.getMyOrders = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getMyOrders");

    const result = await orderService.getMyOrders(req.user);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getMyOrders:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};
orderController.updateOrder = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("updateOrder");
    const input: OrderUpdateInput = req.body;
    const result = await orderService.updateOrder(req.user, input);
    res.status(HttpCode.OK).json({ result });
  } catch (err) {
    console.log("Error, updateOrder:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};
export default orderController;
