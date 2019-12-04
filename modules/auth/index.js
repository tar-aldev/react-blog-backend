const router = require("express").Router();
const controller = require("./auth.controller");

router.post("/signin", controller.signin);
router.post("/signin-google", controller.googleSignin);
router.get("/google-signin-url", controller.googleSigninUrl);
router.post("/token/refresh", controller.refreshToken);
router.post("/token/revoke", controller.revokeToken);

module.exports = router;
