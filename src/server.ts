import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL as string)
  .then((data) => {
    console.log("SUCCED");
    const PORT = process.env.PORT ?? 3077;
    app.listen(PORT, function () {
      console.info(
        `The server is running succesfully on port: http://localhost:${PORT}/admin`,
      );
    });
  })
  .catch((err) => {
    console.log("error on mongodb", err);
  });
