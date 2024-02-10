const jwt = require("jsonwebtoken");

// Authentication
exports.authenticateUser = (req, res, next) => {
  // Check whether access token exists in headers
  if (!req.headers.accesstoken)
    return res.status(400).send({ msg: "Token not found" });

  // Verify Token
  try {
    const user = jwt.verify(req.headers.accesstoken, process.env.SECRET_KEY);
    next();
  } catch (err) {
    console.error(err);
    return res.status(400).send({ msg: "Unauthorised" });
  }
};

