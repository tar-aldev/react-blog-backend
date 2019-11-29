const router = require("express").Router();
const controller = require("./posts.controller");
const withAuth = require("../../middleware/withAuth");

router.get("/", withAuth(false), controller.getPaginated);
router.get("/:id", controller.getOne);
router.post("/", withAuth(), controller.addOne);
router.put("/:id", controller.update);

module.exports = router;
