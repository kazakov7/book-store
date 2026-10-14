import path from "path";
import fs from "fs";
import multer from "multer";
const { v4 } = require("uuid");

function getTargetImageStroage(address: any) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = `./uploads/${address}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      console.log(file);
      const extension = path.parse(file.originalname).ext;
      const random_name = v4() + extension;
      cb(null, random_name);
    },
  });
}

const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const makeUploader = (address: string) => {
  const storage = getTargetImageStroage(address);
  return multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Only image files (jpg, jpeg, png, webp, gif) are allowed!"));
      }
    },
  });
};

export default makeUploader;
