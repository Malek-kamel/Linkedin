import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";

export function uploadFile({ folder }) {
  const storage = diskStorage({
    destination: `uploads/${folder}`,
    filename: (req, file, cb) => {
      cb(null, nanoid() + file.originalname);
    },
  });
  const fileFilter = (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("invalid format, file must be pdf"), false);
    }
    return cb(null, true);
  };

  const multerUplaod = multer({ storage, fileFilter });
  return multerUplaod;
}
