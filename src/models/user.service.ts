import { memberStatus, memberType } from "../libs/enums/member.enum";

import {
  Member,
  MemberInput,
  MemberLoginInput,
  MemberUpdateInput,
} from "../libs/types/user.type";
import { strToObjectId } from "../libs/utils/config";
import Errors, { HttpCode, Message } from "../libs/utils/errors";
import userModels from "../schema/user.models";
import jwt from "jsonwebtoken";
const bcrypt = require("bcrypt");

class UserService {
  private readonly userModel;
  constructor() {
    this.userModel = userModels;
  }

  //≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈SPA≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈//
  //≈≈≈≈≈≈≈≈≈≈≈USER SIGN UP LOGIC≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈//
  public async Signup(input: MemberInput): Promise<Member> {
    const existingUser = await userModels.findOne({
      $or: [
        { memberPhone: input.memberPhone },
        { memberNick: input.memberNick },
      ],
    });

    if (existingUser) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE_EMAIL);
    }

    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
    input.memberType = memberType.USER;
    input.memberStatus = memberStatus.ACTIVE;

    try {
      const result = await this.userModel.create(input);
      result.memberPassword = "";
      return result.toJSON() as unknown as Member;
    } catch (err) {
      console.log("erorr", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATED_FAILED);
    }
  }
  //≈≈≈≈≈≈≈≈≈≈≈USER LOGIN LOGIC≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈//
  public async Login(input: MemberLoginInput): Promise<Member> {
    const result = await this.userModel
      .findOne(
        {
          memberNick: input.memberNick,
          memberStatus: { $ne: memberStatus.DELETE },
        },
        {
          memberNick: 1,
          memberPassword: 1,
          memberStatus: 1,
        },
      )
      .exec();

    if (!result) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.NO_MEMBER_FOUND);
    }

    if (result.memberStatus == memberStatus.BLOCK) {
      throw new Errors(HttpCode.NOT_FOUND, Message.BLOCKED_USER);
    }

    const verify = await bcrypt.compare(
      input.memberPassword,
      result.memberPassword,
    );
    if (!verify) throw new Errors(HttpCode.NOT_FOUND, Message.WRONG_PASSWORD);

    try {
      const res = await this.userModel.findById(result._id).lean().exec();

      return res as unknown as Member;
    } catch (err) {
      console.log("Error on mongoDB", err);
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }
  }

  public async updateMember(
    member: Member,
    input: MemberUpdateInput,
  ): Promise<Member> {
    try {
      const memberId = strToObjectId(member._id);
      delete (input as any).memberType;
      delete input.memberStatus;

      if (input.memberPassword) {
        const salt = await bcrypt.genSalt();
        input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
      }

      const result = await this.userModel
        .findOneAndUpdate({ _id: memberId }, input, { returnDocument: "after" })
        .exec();

      if (!result)
        throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

      return result as unknown as Member;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  //≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈BSSR≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈//
  //≈≈≈≈≈≈≈≈≈≈≈ ADMIN SIGN UP LOGIC≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈//
  public async postSignup(input: MemberInput): Promise<Member> {
    const result = await this.userModel
      .findOne({ memberType: memberType.ADMIN })
      .exec();
    if (result) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATED_FAILED);

    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    try {
      const res = await this.userModel.create(input);
      res.memberPassword = "";
      return res as unknown as Member;
    } catch (err) {
      console.log(err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATED_FAILED);
    }
  }

  //≈≈≈≈≈≈≈≈≈≈≈ ADMIN LOGIN LOGIC≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈//
  public async postLogin(input: MemberLoginInput): Promise<Member> {
    const result = await this.userModel
      .findOne(
        {
          memberType: memberType.ADMIN,
          memberNick: input.memberNick,
        },
        {
          memberNick: 1,
          memberPassword: 1,
        },
      )
      .exec();

    if (!result) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.NO_MEMBER_FOUND);
    }

    const isMatch = await bcrypt.compare(
      input.memberPassword,
      result.memberPassword,
    );
    if (!isMatch) {
      throw new Errors(HttpCode.FORBIDDEN, Message.WRONG_PASSWORD);
    }
    try {
      const res = await this.userModel.findById(result._id).exec();
      return res as unknown as Member;
    } catch (err) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_FOUND);
    }
  }

  //≈≈≈≈≈≈≈≈≈≈≈ ADMIN GET USERS LOGIC≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈//
  public async getUsers(): Promise<Member[]> {
    const result = await this.userModel
      .find({
        memberType: memberType.USER,
      })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result as unknown as Member[];
  }
  //≈≈≈≈≈≈≈≈≈≈≈ ADMIN GET USER INFO LOGIC≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈//
  public async getUserInfo(input: string): Promise<Member> {
    const memberId = strToObjectId(input);
    const member = await this.userModel.findById({
      _id: memberId,
    });
    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return member as unknown as Member;
  }
  //≈≈≈≈≈≈≈≈≈≈≈ADMIN UPDATE USER STATUS LOGIC≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈//
  public async updateUser(id: string, input: string): Promise<Member> {
    const memberId = strToObjectId(id);
    const result = await this.userModel.findOneAndUpdate(
      //@ts-ignore
      { _id: memberId },
      { $set: { memberStatus: input } },
      { returnDocument: "after" },
    );
    if (!result)
      throw new Errors(HttpCode.NOT_MODIFIED, Message.CREATED_FAILED);
    console.log("1111", result);
    return result as unknown as Member;
  }
}
export default UserService;
