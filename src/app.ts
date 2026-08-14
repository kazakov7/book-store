import express from "express";
import session from "express-session";
import path from "path";
import dotenv from "dotenv";
import adminRouter from "./admin";
import userRouter from "./user";
import ConnectMongoDb from "connect-mongodb-session";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
const app = express();

const MongoDbStore = ConnectMongoDb(session);
const store = new MongoDbStore({
  uri: String(process.env.MONGO_URL),
  collection: "sessions",
});
//kirish
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.static(path.join(__dirname, "public")));
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
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//routers
app.use("/user", userRouter); //SPA
app.use("/admin", adminRouter); //ssr

export default app;
