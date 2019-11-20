const router = require("express").Router();
const controller = require("./posts.controller");
const checkToken = require("../../middleware/checkToken");

router.get("/", controller.getPaginated);
router.get("/:id", controller.getOne);
router.post("/", checkToken, controller.addOne);
router.patch("/", controller.update);

module.exports = router;
