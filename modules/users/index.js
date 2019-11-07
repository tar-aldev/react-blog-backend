const router = require("express").Router();
const controller = require("./users.controller");

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", controller.addOne);
router.patch("/", controller.update);

module.exports = router;
