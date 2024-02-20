import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";

export function uploadFileCloud() {
  const storage = diskStorage({});
  const fileFilter = (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("invalid format, file must be pdf"), false);
    }
    return cb(null, true);
  };

  const multerUplaod = multer({ storage, fileFilter });
  return multerUplaod;
}
