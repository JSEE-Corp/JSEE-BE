import multer, { StorageEngine } from "multer";
import { Request, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import path from "path";
import fs from "fs"

// 파일을 저장할 디렉토리 설정
class imageController {
  constructor() {}
  imagePost: RequestHandler = async (req, res, next) => {
    this.upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).json({ err: err.message });
      }

      if (!req.file) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "파일이 업로드되지 않았습니다." });
      }

      return res.status(StatusCodes.OK).json(req.file.filename);
    });
  };

  storage: StorageEngine = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
    ) => {
      const uploadPath = path.join(__dirname, "../../uploads");

      fs.mkdir(uploadPath, { recursive: true }, (err) => {
        if (err) {
          return cb(err, uploadPath);
        }
        cb(null, uploadPath);
      });
    },

    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
    ) => {
      const uniqueSuffix = Date.now() + "-" + file.originalname;
      cb(null, uniqueSuffix); // 파일 이름 설정
    },
  });

  // 이미지 파일 확인
  fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("허용되지 않는 파일 형식입니다");
      return cb(error as any, false);
    }
    cb(null, true);
  };

  upload = multer({
    storage: this.storage,
    fileFilter: this.fileFilter,
    limits: {
      fileSize: 5000000, // 파일 5MB 제한
    },
  });
}

module.exports = imageController;
