import express from "express";
import userController from "./controllers/user.controller";
import makeUploader from "./libs/utils/uploder";
import bookController from "./controllers/book.controller";
import orderController from "./controllers/order.controller";

const userRouter = express.Router();

userRouter.post(
  "/signup",
  makeUploader("members").single("memberImage"),
  userController.postSignup,
);
userRouter.post("/login", userController.postLogin);
userRouter.post("/logout", userController.verifyAuth, userController.logout);
userRouter.post(
  "/update",
  makeUploader("members").single("memberImage"),
  userController.verifyAuth,
  userController.updateMember,
);
//BOOKS
userRouter.get(
  "/book/:id",
  userController.retrieveAuth,
  bookController.getBook,
);

userRouter.post(
  "/book/:id/rating",
  userController.verifyAuth,
  bookController.rateBook,
);
userRouter.get("/product/all", bookController.getProducts);
//≈≈≈≈≈≈≈≈≈≈≈ORDER≈≈≈≈≈≈≈≈≈≈≈≈≈
userRouter.post(
  "/order/create",
  userController.verifyAuth,
  orderController.createOrder,
);
userRouter.get(
  "/order/all",
  userController.verifyAuth,
  orderController.getMyOrders,
);
userRouter.post(
  "/order/update",
  userController.verifyAuth,
  orderController.updateOrder,
);
export default userRouter;
