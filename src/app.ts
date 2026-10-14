import express from "express";
import session from "express-session";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import adminRouter from "./admin";
import userRouter from "./user";
import ConnectMongoDb from "connect-mongodb-session";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config(
  {
    path: process.env.NODE_ENV === "production" ? ".env.production" : ".env"
  }
);
const app = express();

const MongoDbStore = ConnectMongoDb(session);
const store = new MongoDbStore({
  uri: String(process.env.MONGO_URL),
  collection: "sessions",
});

const publicDir = fs.existsSync(path.join(__dirname, "public"))
  ? path.join(__dirname, "public")
  : path.join(__dirname, "..", "src", "public");
const viewsDir = fs.existsSync(path.join(__dirname, "views"))
  ? path.join(__dirname, "views")
  : path.join(__dirname, "..", "src", "views");

//kirish
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.static(publicDir));
app.use("/uploads", express.static("./uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//session
app.use(
  session({
    secret: process.env.SECRET!,
    resave: true,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 14,
    },
  }),
);
app.use(cookieParser());
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});
app.use((req, res, next) => {
  res.locals.currentPath = req.originalUrl;
  next();
});

//views
app.set("views", viewsDir);
app.set("view engine", "ejs");
//routers
app.use("/user", userRouter); //SPA
app.use("/admin", adminRouter); //ssr

export default app;
