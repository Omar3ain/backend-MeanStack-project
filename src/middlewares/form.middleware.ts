import multer from "multer";
import { Request } from "express";
import path from "path";

const formUpload = (filePath : string) :  multer.Multer => {
  return  multer({
    storage: multer.diskStorage({
      destination: (req: Request, file, cb) => {
        cb(null, filePath)
      },
      filename: (req: Request, file, cb) => {
        let timeStamp = Date.now();
        cb(null, file.originalname.split('.')[0] + "-" + timeStamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
      },
    }),
    limits: { fileSize: 0.25 * 1024 * 1024 },
    fileFilter: (req: Request, file, cb) => {
      let ext = path.extname(file.originalname);
      if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
        return cb(new Error('Only images are allowed!'));
      }
      cb(null, true);
    }
  });
}

export default formUpload;