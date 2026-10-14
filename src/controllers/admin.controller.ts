import { T } from "../libs/types/common";
import { NextFunction, Request, Response } from "express";
import {
  AdminRequest,
  ExtendedRequest,
  MemberInput,
  MemberLoginInput,
} from "../libs/types/user.type";
import UserService from "../models/user.service";
import { memberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/utils/errors";
import ProductService from "../models/product.service";
import { BookInput, BookUpdateInput } from "../libs/types/product.type";
import AuthService from "../models/auth.service";
//instense of UserService()
const userService = new UserService();
const productService = new ProductService();
const authService = new AuthService();

const adminController: T = {};
//≈≈≈≈≈≈≈≈≈≈≈≈≈Home page≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈
adminController.getHome = async (req: Request, res: Response) => {
  try {
    console.log("getHome");
    const result = await userService.getUsers();
    const result2 = await productService.getBooks();
    const result3 = await productService.getOrders();
    res.render("home", {
      users: result,
      books: result2,
      orders: result3,
      currentPath: req.path,
    });
  } catch (err) {
    console.log("Error getHome:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

//≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈Sign-up≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈
adminController.getSignup = async (req: Request, res: Response) => {
  try {
    console.log("getSignup");
    res.render("signup");
  } catch (err) {
    console.log("error getSignup", err);
  }
};
adminController.postSignup = async (req: AdminRequest, res: Response) => {
  try {
    console.log("postSignup");
    if (!req.file)
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATED_FAILED);
    const newUser: MemberInput = req.body;
    newUser.memberImage = req.file.path;
    newUser.memberType = memberType.ADMIN;

    const user = await userService.postSignup(newUser);
    req.session.user = user;
    req.session.save(() => {
      res.send(`<script>window.location.replace('/admin/home')</script>`);
    });
  } catch (err) {
    console.log("error postSignup", err);
    res.send(
      `<script>alert("Create is faile!"); window.location.replace('/admin/signup')</script>`,
    );
  }
};

//≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈Login≈≈≈≈≈≈≈≈≈≈≈≈≈≈
adminController.getLogin = (req: Request, res: Response) => {
  try {
    console.log("getLogin");
    res.render("login");
  } catch (err) {
    console.log("error getHome", err);
  }
};
adminController.postLogin = async (req: Request, res: Response) => {
  try {
    console.log("postLogin");
    const input: MemberLoginInput = req.body;
    const user = await userService.postLogin(input);
    req.session.user = user;
    req.session.save(() => {
      res.send(`<script>window.location.replace('/admin/home')</script>`);
    });
  } catch (err) {
    console.log("error getHome", err);
    res.send(
      `<script>alert("No member with that member nick!"); window.location.replace('/admin')</script>`,
    );
  }
};

//≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈LogOut≈≈≈≈≈≈≈≈≈≈≈≈≈≈
adminController.logout = (req: Request, res: Response) => {
  try {
    console.log("logout");
    req.session.destroy(() => {
      res.send(`<script>window.location.replace('/admin/')</script>`);
    });
  } catch (err) {
    if (err) return res.status(500).send("Logout error");
    res.clearCookie("connect.sid");
    res.redirect("/admin/");
  }
};

//≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈USER≈≈≈≈≈≈≈≈≈≈≈≈≈≈
adminController.getUsers = async (req: Request, res: Response) => {
  try {
    console.log("getUsers");
    const result = await userService.getUsers();
    res.render("users", { users: result });
  } catch (err) {
    console.log("error getUsers", err);
    res.send(`<script>window.location.replace('/admin/login')</script>`);
  }
};
adminController.updateUser = async (req: AdminRequest, res: Response) => {
  try {
    console.log("updateUser");
    const id = req.params.id as string;
    const status = req.params.status as string;
    const result = await userService.updateUser(id, status);
    res.status(HttpCode.OK).json({ updadet: result });
  } catch (err) {
    console.log("error updateUser", err);
    res.json({ error: err });
  }
};

adminController.getUserInfo = async (req: AdminRequest, res: Response) => {
  try {
    console.log("getUserInfo");
    const memberId = req.params.id as string;
    const result = await userService.getUserInfo(memberId);
    res.render("components/user-info", { user_info: result });
  } catch (err) {
    console.log("error updateUser", err);
    res.json({ error: err });
  }
};
//≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈BOOKS≈≈≈≈≈≈≈≈≈≈≈≈≈≈
adminController.addBook = async (req: AdminRequest, res: Response) => {
  try {
    console.log("getBooks");
    if (!req.files || req.files.length === 0)
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATED_FAILED);
    const newBook: BookInput = req.body;
    newBook.images = req.files.map((ele) => {
      return ele.path;
    });
    await productService.addBook(newBook);
    res.send(
      `<script>alert("Succesfully!"); window.location.replace('/admin/books');</script>`,
    );
  } catch (err) {
    console.log("error addBook", err);
    res.json({ error: err });
  }
};
adminController.getBooks = async (req: Request, res: Response) => {
  try {
    console.log("getBooks");
    const result = await productService.getBooks();
    res.render("books", { books: result });
  } catch (err) {
    console.log("error getBooks", err);
    res.json({ error: err });
  }
};

adminController.updateBook = async (req: AdminRequest, res: Response) => {
  try {
    console.log("updateBook");
    const input: BookUpdateInput = req.body;
    if (req.files && req.files.length > 0) {
      input.images = req.files.map((ele) => {
        return ele.path;
      });
    }
    console.log(input);
    await productService.updateBook(input);
    res.send(
      `<script>alert("Succesfully updated!"); window.location.replace('/admin/books');</script>`,
    );
  } catch (err) {
    console.log("error updateBook", err);
    res.json({ error: err });
  }
};
adminController.verifyAdmin = (
  req: AdminRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.session?.user?.memberType == memberType.ADMIN) {
    req.user = req.session.user;
    next();
  } else {
    const message = Message.NOT_AUTHENTICATED;
    res.send(
      `<script>alert("${message}"); window.location.replace('/admin/');</script>`,
    );
  }
};

export default adminController;
