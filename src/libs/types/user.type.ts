import { ObjectId, Types } from "mongoose";
import { memberStatus, memberType } from "../enums/member.enum";
import { Request } from "express";
import { Session } from "express-session";
export interface Member {
  _id: Types.ObjectId;
  memberType: memberType;
  memberStatus: memberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
  memberImage?: string;
  memberAddres?: string;
  memberDesc?: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface MemberUpdateInput {
  memberStatus?: memberStatus;
  memberNick?: string;
  memberPhone?: string;
  memberPassword?: string;
  memberImage?: string;
  memberAddres?: string;
  memberDesc?: string;
}

export interface MemberInput {
  memberImage: string;
  memberType?: memberType;
  memberStatus?: memberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
}
export interface MemberLoginInput {
  memberNick: string;
  memberPassword: string;
}

export interface AdminRequest extends Request {
  user: Member;
  session: Session & { user: Member };
  file: Express.Multer.File;
  files: Express.Multer.File[];
}
export interface ExtendedRequest extends Request {
  user: Member;
  file: Express.Multer.File;
  files: Express.Multer.File[];
}
