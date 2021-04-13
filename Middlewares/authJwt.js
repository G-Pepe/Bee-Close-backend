const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../Models/userSchema");
dotenv.config()

const auth = (req, res, next) => {
  const authHeader = req.get("Authorization");

    if (authHeader) {
      const token = authHeader.split(" ")[1];

      if (token === null) {
        return res.status(403).send({ message: "No token provided!" });
      }

      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.userId;
        req.hiveId = decoded.hiveId;
        next();
      });
  } else {
      next();
  }
};

module.exports = auth;
