const jwt = require("jsonwebtoken");

/* Some routes need user._id from token but shoould also work without token */
module.exports = (error = true) => (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    req.jwtPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
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
