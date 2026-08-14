import express from "express";
import adminController from "./controllers/admin.controller";
import makeUploader from "./libs/utils/uploder";
const adminRouter = express.Router();

//ADMIN
adminRouter.get("/", adminController.getLogin);
adminRouter.post("/login", adminController.postLogin);
adminRouter
  .get("/signup", adminController.getSignup)
  .post(
    "/signup",
    makeUploader("members").single("memberImage"),
    adminController.postSignup,
  );
adminRouter.get("/home", adminController.verifyAdmin, adminController.getHome);
adminRouter.get("/logout", adminController.verifyAdmin, adminController.logout);

//USERS
adminRouter.get(
  "/users",
  adminController.verifyAdmin,
  adminController.getUsers,
);
adminRouter.get(
  "/user/update/:id/:status",
  adminController.verifyAdmin,
  adminController.updateUser,
);
adminRouter.get(
  "/user/info/:id",
  adminController.verifyAdmin,
  adminController.getUserInfo,
);

//BOOKS
adminRouter.post(
  "/book/add",
  adminController.verifyAdmin,
  makeUploader("books").array("images", 5),
  adminController.addBook,
);
adminRouter.get(
  "/books",
  adminController.verifyAdmin,
  adminController.getBooks,
);

adminRouter.post(
  "/book/update",
  adminController.verifyAdmin,
  adminController.updateBook,
);

export default adminRouter;
