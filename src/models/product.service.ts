import { ObjectId, Types } from "mongoose";
import {
  Book,
  BookInput,
  BookInquery,
  BookUpdateInput,
} from "../libs/types/product.type";
import { strToObjectId } from "../libs/utils/config";
import Errors, { HttpCode, Message } from "../libs/utils/errors";
import productModels from "../schema/product.models";
import { BookStatus, RatingFilter } from "../libs/enums/product.enum";
import RatingService from "./rating.service";
import { ViewInput } from "../libs/types/view.group";
import { ViewGroup } from "../libs/enums/view.group";
import ViewService from "./VIew.service";
import { T } from "../libs/types/common";
import orderItemModel from "../schema/order.item.model";
import orderModel from "../schema/order.model";

class ProductService {
  private readonly productModel;
  private readonly orderItemModel;
  private readonly ratingService;
  private readonly orderModel;
  public viewService;
  constructor() {
    this.orderItemModel = orderItemModel;
    this.orderModel = orderModel;
    this.productModel = productModels;
    this.ratingService = new RatingService();
    this.viewService = new ViewService();
  }

  //≈≈≈≈≈≈≈≈≈≈≈≈≈ADD BOOK ≈≈≈≈≈≈≈≈≈≈≈≈≈≈
  public async addBook(input: BookInput): Promise<Book> {
    try {
      const result = await this.productModel.create(input);
      return result as unknown as Book;
    } catch (err) {
      console.log("Error on mongodb addbook", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATED_FAILED);
    }
  }

  public async getBooks(): Promise<Book[]> {
    try {
      const result = await this.productModel.find();
      return result as unknown as Book[];
    } catch (err) {
      console.log("Error on mongodb addbook", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATED_FAILED);
    }
  }
  public async getOrders(): Promise<Book[]> {
    try {
      const result = await this.orderModel.find();
      return result as unknown as Book[];
    } catch (err) {
      console.log("Error on mongodb addbook", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATED_FAILED);
    }
  }

  public async updateBook(input: BookUpdateInput): Promise<Book> {
    const productId = strToObjectId(input.bookId);
    const result = await this.productModel.findOneAndUpdate(
      { _id: productId },
      input,
      { new: true },
    );
    if (!result)
      throw new Errors(HttpCode.NOT_MODIFIED, Message.CREATED_FAILED);
    return result as unknown as Book;
  }

  public async getBook(
    memberId: Types.ObjectId | null,
    bookId: string,
  ): Promise<any> {
    const productId = strToObjectId(bookId);

    const book = await this.productModel.findOne({
      _id: productId,
      status: BookStatus.ACTIVE,
    });

    if (!book) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }
    //VIEW LOGIC
    if (memberId) {
      //Check view log existe
      const input: ViewInput = {
        memberId: memberId,
        viewRefId: productId,
        viewGroup: ViewGroup.PRODUCT,
      };
      const existView = await this.viewService.checkViewExitence(input);
      console.log("exist: ", !!existView);
      if (!existView) {
        //InsertView
        await this.viewService.insertMemberView(input);

        //increase counts
        const result = await this.productModel
          .findByIdAndUpdate(productId, { $inc: { views: +1 } }, { new: true })
          .exec();
      }
    }

    //RATING LOGIC
    let myRating = null;

    if (memberId) {
      const rating = await this.ratingService.findMemberRating(
        memberId,
        productId,
      );

      myRating = rating ? rating.rating : null;
    }

    return {
      ...book.toObject(),
      myRating,
    };
  }

  public async rateBook(
    memberId: Types.ObjectId,
    bookId: string,
    rating: number,
    orderr: string,
    orderItemIdd: string,
  ): Promise<Book> {
    const productId = strToObjectId(bookId);
    const orderId = strToObjectId(orderr);
    const orderItemId = strToObjectId(orderItemIdd);

    const book = await this.productModel.findOne({
      _id: productId,
      status: BookStatus.ACTIVE,
    });

    if (!book) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    const exist = await this.ratingService.findMemberRating(
      memberId,
      productId,
    );

    if (!exist) {
      await this.ratingService.createRating({
        memberId,
        bookId: productId,
        rating,
      });
    } else {
      await this.ratingService.updateRating(exist._id, rating);
    }

    const stats = await this.ratingService.getRatingStats(productId);

    const result = await this.productModel.findByIdAndUpdate(
      productId,
      {
        averageRating: stats.averageRating,
        ratingsCount: stats.ratingsCount,
      },
      { new: true },
    );
    const order = await this.orderModel.findOne({
      _id: orderId,
      memberId,
    });

    const res = await this.orderItemModel
      .findOneAndUpdate(
        {
          _id: orderItemId,
          orderId: orderId,
          productId: productId,
        },
        {
          userRating: rating,
        },
        {
          new: true,
        },
      )
      .exec();
    console.log("7832672", res);

    return result as unknown as Book;
  }
  public async getProducts(inquery: BookInquery): Promise<Book[]> {
    const match: T = { status: BookStatus.ACTIVE };
    if (inquery.category) {
      if (inquery.category != "ALL") {
        match.category = inquery.category;
      }
    }
    if (inquery.language) {
      if (inquery.language != "ALL") {
        match.language = inquery.language;
      }
    }

    if (inquery.rating != undefined) {
      match.averageRating = {
        $gte: Number(inquery.rating),
      };
    }
    if (inquery.search) {
      match.title = { $regex: new RegExp(inquery.search, "i") };
    }
    let sort: T = {};

    if (inquery.order === "priceLow") {
      sort = { price: 1 };
    } else if (inquery.order === "priceHigh") {
      sort = { price: -1 };
    } else if (inquery.order === "rating") {
      sort = { averageRating: -1 };
    } else if (inquery.order === "createdAt") {
      sort = { createdAt: -1 };
    } else if (inquery.order === "views") {
      sort = { views: -1 };
    } else if (inquery.order === "soldCount") {
      sort = { soldCount: -1 };
    } else {
      sort = {};
    }

    const result = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (inquery.page * 1 - 1) * inquery.limit },
        { $limit: inquery.limit * 1 },
      ])
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }
}
export default ProductService;
