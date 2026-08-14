import { Types } from "mongoose";

export interface Rating {
  _id: Types.ObjectId;
  memberId: Types.ObjectId;
  bookId: Types.ObjectId;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RatingInput {
  memberId: Types.ObjectId;
  bookId: Types.ObjectId;
  rating: number;
}
