import mongoose, { Schema } from "mongoose";
import { memberStatus, memberType } from "../libs/enums/member.enum";
const MemberSchema = new Schema(
  {
    memberType: {
      type: String,
      enum: memberType,
      default: memberType.USER,
    },
    memberStatus: {
      type: String,
      enum: memberStatus,
      default: memberStatus.ACTIVE,
    },
    memberEmail: {
      type: String,
      index: { unique: true, sparse: true },
    },
    memberNick: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },
    memberPhone: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },
    memberPassword: {
      type: String,
      select: false,
      required: true,
    },
    memberImage: {
      type: String,
    },
    memberAddres: {
      type: String,
    },
    memberDesc: {
      type: String,
    },
  },
  { timestamps: true }, //creatAt, updatedAt
);

export default mongoose.model("Member", MemberSchema);
