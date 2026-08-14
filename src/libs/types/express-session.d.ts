import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      _id: ObjectId;
      memberType: memberType;
      memberStatus: memberStatus;
      memberNick: string;
      memberPhone: string;
      memberPassword: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }
}
