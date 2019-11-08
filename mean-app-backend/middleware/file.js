const multer = require('multer');
const path = require("path");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");

    if(isValid!==undefined){
      error = null;
    }
    const imagesPath = path.join(__dirname, '../images');
    cb(error, imagesPath)
  },
  filename: function (req, file, cb) {
    const name = file.originalname.toLowerCase().split(' ').join("-");
    const date = Date.now();
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, `${name}-${date}.${ext}`);
  }
});

module.exports = multer({storage:storage}).single("image")
