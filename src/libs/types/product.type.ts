import { ObjectId } from "mongoose";
import { BookCategory, BookLanguage, BookStatus } from "../enums/product.enum";

export interface Book {
  _id: ObjectId;
  title: string;
  author: string;
  isbn: string;
  category: BookCategory;
  price: number;
  stock: number;
  language: BookLanguage;
  publishedYear: number;
  status: BookStatus;
  images: string[];
  rating?: number;
  averageRating?: number;
  description?: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  pages: number;
  ratingsCount?: number;
}
export interface BookInput {
  title: string;
  author: string;
  isbn: string;
  category: BookCategory;
  price: number;
  stock: number;
  status?: BookStatus;
  images: string[];
  description?: string;
}

export interface BookUpdateInput {
  title?: string;
  author?: string;
  isbn?: string;
  category?: BookCategory;
  price?: number;
  stock?: number;
  status?: BookStatus;
  images?: string[];
  description?: string;
  bookId: string;
}
export interface BookInquery {
  order: string;
  page: number;
  limit: number;
  category?: BookCategory;
  rating?: number;
  language?: string;
  search?: string;
}
