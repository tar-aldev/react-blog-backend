const jwt = require("jsonwebtoken");

modules.exports = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, "secret");
    req.jwtPayload = payload;
  } catch (error) {
    res.status(401).json({ message: "Not authenticated!" });
  }
  jwt.verify();
};
