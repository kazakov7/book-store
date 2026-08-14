import mongoose, { Schema } from "mongoose";
import {
  BookCategory,
  BookLanguage,
  BookStatus,
} from "../libs/enums/product.enum";

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      match: /^(97(8|9))?\d{9}(\d|X)$/,
    },
    category: {
      type: String,
      enum: Object.values(BookCategory),
      required: true,
    },
    publishedYear: {
      type: Number,
      required: true,
    },
    language: {
      type: String,
      enum: BookLanguage,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(BookStatus),
      default: BookStatus.ACTIVE,
    },
    images: {
      type: [String],
      default: [],
      required: true,
    },
    description: {
      type: String,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    averageRating: {
      type: Number,
      default: 0,
    },

    ratingsCount: {
      type: Number,
      default: 0,
    },
    pages: {
      type: Number,
      min: 1,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }, //createdAt, updatedAt
);

export default mongoose.model("Book", bookSchema);
