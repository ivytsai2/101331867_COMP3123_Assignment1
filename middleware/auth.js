const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).send({
      status: false,
      message: "Token not found..."
    });
  }
  try {
    const decoded = jwt.verify(token, "my_secret_key");
    req.user = decoded;
  } catch (err) {
    return res.status(403).send({
      status: false,
      message: "Invalid Token"
    });
  }
  return next();
};

module.exports = verifyToken;