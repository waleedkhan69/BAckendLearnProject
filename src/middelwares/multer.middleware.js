import multer from "multer";

const storage = multer.diskStorage({
 destination: function (req, file, cb) {
  cb(null, './public/temp');  // ✅ Path ka '/' hata de
 },
 filename: function (req, file, cb) {
  cb(null, file.originalname);
 }
});

export const upload = multer({ storage: storage }); // ✅ Named Export
