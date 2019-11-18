const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    console.log("token", token);
    const payload = jwt.verify(token, "secret");
    req.jwtPayload = payload;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authenticated!" });
  }
};
