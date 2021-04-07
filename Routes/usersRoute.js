const express = require("express");
const User = require("../Models/userSchema");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const auth= require("../Middlewares/authJwt")


router.post("/signup", async (req, res, next) => {
  try {
    await User.findOne({
      email: req.body.email,
    }).then((user) => {
      if (user) {
        return res.status(400).send({ message: "user already registered" });
      } else {
        const newUser = new User(req.body);
        newUser.save();
        res.status(200).send({ message: "User registered successfully" });
        
      }
    });
  } catch (err) {
    next(err);
  }
});


router.post("/login",(req, res, next) => {
  try {
    User.findOne({
      email: req.body.email,
    }).then((user) => {
      if (!user) {
        return res.status(401).send({ message: "incorrect email or password" });
      } else {
        /* console.log(req.body);
        console.log(user); */
        let match = bcrypt.compareSync(req.body.password, user.password);
        if (!match) {
          return res
            .status(401)
            .send({ message: "incorrect password or email" });
        } else {
          let token = jwt.sign({ _id: user._id, email: user.email }, process.env.SECRET)
          res.status(200)
          .header("x-auth", token)
          .send({ message: "login successful", success: true, user: user, token:token })

          
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
