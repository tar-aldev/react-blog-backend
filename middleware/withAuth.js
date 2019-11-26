const jwt = require("jsonwebtoken");

/* Some routes need user._id from token but shoould also work without token */
module.exports = (error = true) => (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    console.log("token", token);
    const payload = jwt.verify(token, "secret");
    req.jwtPayload = payload;
    next();
  } catch (e) {
    console.log("error token decode", e);
    if (error) {
      return res
        .status(401)
        .json({ message: e.message || "Not authenticated!" });
    }
    req.jwtPayload = {};
    next();
  }
};
