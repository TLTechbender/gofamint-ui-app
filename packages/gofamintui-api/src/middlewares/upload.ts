import multer from "multer";
import { AppError } from "../utils/appError";
import { AuthRequest, Multer } from "../common/constants";


const storage = multer.memoryStorage();


const imageFilter = (
  req: AuthRequest,
  file: Multer["File"],
  cb: multer.FileFilterCallback
) => {
  
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(
      new AppError(
        "Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.",
        400,
        [{ profilePic: "Invalid image format" }]
      )
    );
  }
};


export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB max
  },
});