import { T } from "../libs/types/common";
import { NextFunction, Request, Response } from "express";
import {
  ExtendedRequest,
  MemberInput,
  MemberLoginInput,
  MemberUpdateInput,
} from "../libs/types/user.type";
import UserService from "../models/user.service";
import Errors, { HttpCode, Message } from "../libs/utils/errors";
import AuthService from "../models/auth.service";
import { AUTH_TIMER } from "../libs/utils/config";
import ProductService from "../models/product.service";
const userService = new UserService();
const authService = new AuthService();
const productService = new ProductService();
const userController: T = {};

userController.postSignup = async (req: Request, res: Response) => {
  try {
    console.log("postSignup");
    const input: MemberInput = req.body;
    input.memberImage = req.file?.path as string;
    const result = await userService.Signup(input);
    console.log(result);
    const token = await authService.createToken(result);
    res.cookie("accesToken", token, {
      maxAge: AUTH_TIMER * 6000 * 1000,
      httpOnly: false,
    });
    res.status(HttpCode.CREATED).json({ member: result, accesToken: token });
  } catch (err) {
    console.log("Error getTopUsers:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};
userController.postLogin = async (req: Request, res: Response) => {
  try {
    console.log("postLogin");
    const input: MemberLoginInput = req.body;
    const result = await userService.Login(input);
    const token = await authService.createToken(result);
    res.cookie("accesToken", token, {
      maxAge: AUTH_TIMER * 6000 * 1000,
      httpOnly: false,
    });

    res.status(HttpCode.OK).json({ member: result, accesToken: token });
  } catch (err) {
    console.log("Error getTopUsers:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};
userController.logout = (req: ExtendedRequest, res: Response) => {
  try {
    console.log("logout");
    res.cookie("accesToken", null, { maxAge: 0, httpOnly: true });
    res.status(HttpCode.OK).json({ logout: true });
  } catch (err) {
    console.log("Error logut:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};
userController.updateMember = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("updateMember");
    const input: MemberUpdateInput = req.body;
    if (req.file) input.memberImage = req.file.path;
    const result = await userService.updateMember(req.user, input);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error updateMember:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

userController.verifyAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies["accesToken"];
    if (token) req.user = await authService.checkAuth(token);

    if (!token)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);

    next();
  } catch (err) {
    console.log("Error verifyAuth:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};
userController.retrieveAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies["accesToken"];
    if (token) req.user = await authService.checkAuth(token);
    next();
  } catch (err) {
    console.log("Error verifyAuth:", err);
    next();
  }
};
export default userController;
