const router = require("express").Router();
const controller = require("./users.controller");
const multer = require("multer");
const withAuth = require("../../middleware/withAuth");
const fs = require("fs");
const path = require("path");

const PATH_TO_IMG = "images";
const fullPath = path.join("public", PATH_TO_IMG);
const folderExists = fs.existsSync(fullPath);

const ACCEPTABLE_MIME_TYPES = ["image/jpeg", "image/jpg"];

const fileFilter = (req, file, callback) => {
  if (ACCEPTABLE_MIME_TYPES.includes(file.mimetype)) {
    return callback(null, true);
  }
  req.multerError = "Invalid file format";
  return callback(null, false);
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (folderExists) {
      callback(null, fullPath);
    } else {
      fs.mkdirSync(fullPath);
      callback(null, fullPath);
    }
  },
  filename: (req, file, callback) => {
    const nameAsArray = file.originalname.split(".");
    const fileExtension = nameAsArray[nameAsArray.length - 1];
    const fileName = `${file.fieldname}-${Date.now()}${Math.floor(
      Math.random() * 100
    )}.${fileExtension}`;
    callback(null, fileName);
  },
});
const upload = multer({
  storage,
  fileFilter,
});

router.get("/me", withAuth(), controller.getCurrentUser);
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", controller.addOne);
router.patch(
  "/profile",
  withAuth(),
  upload.single("avatar"),
  controller.update
);

module.exports = router;
