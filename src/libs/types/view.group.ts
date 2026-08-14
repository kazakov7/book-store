import { ObjectId, Types } from "mongoose";
import { ViewGroup } from "../enums/view.group";

export interface View {
  _id: Types.ObjectId;
  viewGroup: ViewGroup;
  memberId: Types.ObjectId;
  viewRefId: Types.ObjectId;
  createdAt: Date;
  updateAt: Date;
}
export interface ViewInput {
  memberId: Types.ObjectId;
  viewRefId: Types.ObjectId;
  viewGroup: ViewGroup;
}
