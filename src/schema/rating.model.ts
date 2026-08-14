import mongoose, { Schema } from "mongoose";

const ratingSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Member",
    },
    bookId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Book",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true },
);

ratingSchema.index({ memberId: 1, bookId: 1 }, { unique: true });

export default mongoose.model("Rating", ratingSchema);
