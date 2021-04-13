const express = require("express");
const User = require("../Models/userSchema");
const hive = require('../Models/hiveSchema');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const auth= require("../Middlewares/authJwt")


router.post("/signup", async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (user) {
      return res.status(400).send({ message: "user already registered" });
    }

    // const newUser = new User(req.body);
    // await newUser.save();

    const newUser = await User.create(req.body);

    res.status(200).send({ message: "User registered successfully", success: true, user: newUser });
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
          hive.find({ "users._id": user._id }).then( hive=> {
            let token = jwt.sign({userId: user._id, email: user.email, hiveId: hive._id }, process.env.SECRET)
            res.status(200)
            .header("x-auth", token)
            .send({ message: "login successful", success: true, user: user, token:token })
          }
          ) 
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;