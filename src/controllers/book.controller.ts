import { T } from "../libs/types/common";
import { ExtendedRequest } from "../libs/types/user.type";
import Errors, { HttpCode } from "../libs/utils/errors";
import ProductService from "../models/product.service";
import { BookInquery } from "../libs/types/product.type";
import { Request, Response } from "express";
import {
  BookCategory,
  BookLanguage,
  RatingFilter,
} from "../libs/enums/product.enum";
import { Rating } from "../libs/types/rating";
const productService = new ProductService();
const bookController: T = {};
bookController.getBook = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getBook");
    const id = req.params.id as string;
    const memberId = req.user?._id ?? null,
      result = await productService.getBook(memberId, id);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error getProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

bookController.rateBook = async (req: ExtendedRequest, res: Response) => {
  try {
    const memberId = req.user!._id;
    const bookId = req.params.id as string;
    const { rating, orderid, orderItemId } = req.body;

    const result = await productService.rateBook(
      memberId,
      bookId,
      Number(rating),
      orderid,
      orderItemId,
    );

    res.status(HttpCode.OK).json({ result });
  } catch (err) {
    console.log("error rateBook", err);
    res.json({ error: err });
  }
};
bookController.getProducts = async (req: Request, res: Response) => {
  try {
    console.log("getProducts");
    const { order, page, limit, category, language, rating, search } =
      req.query;
    const inquery: BookInquery = {
      order: String(order),
      page: Number(page),
      limit: Number(limit),
    };
    if (category) {
      inquery.category = category as BookCategory;
    }
    if (language) {
      inquery.language = language as BookLanguage;
    }
    if (rating) {
      inquery.rating = Number(rating) as RatingFilter;
    }
    if (search) inquery.search = String(search);

    const result = await productService.getProducts(inquery);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error getProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};
export default bookController;
