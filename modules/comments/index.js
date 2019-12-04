const router = require("express").Router();
const controller = require("./comments.controller");
const withAuth = require("../../middleware/withAuth");

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", withAuth(), controller.addOne);
router.put("/:id", withAuth(), controller.update);
router.delete("/:id", withAuth(), controller.delete);

module.exports = router;
