const express = require("express");
const User = require("../Models/userSchema");
const Hive = require("../Models/hiveSchema");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const auth = require("../Middlewares/authJwt");

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

    res.status(200).send({
      message: "User registered successfully",
      success: true,
      user: newUser,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(401).send({ message: "incorrect email or password" });
    }

    let match = await bcrypt.compareSync(req.body.password, user.password);
    if (!match) {
      return res.status(401).send({ message: "incorrect password or email" });
    }

    const hive = await Hive.findOne({ users: user._id });

    console.log(hive);
    let token = jwt.sign(
      { userId: user._id, email: user.email, hiveId: hive._id },
      process.env.SECRET
    );
    res.status(200).header("x-auth", token).send({
      message: "login successful",
      success: true,
      user: user,
      token: token,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/singleBee", auth, async (req, res, next) => {
  try {
    const singleBee = await User.findById(req.userId);

    if (!singleBee) {
      return res.status(401).send({ message: "bee not found", success: false });
    }

    res.status(200).send({ success: true, user: singleBee });
  } catch (err) {
    next(err);
  }
});

router.get("/beesInMyHive", auth, async (req, res, next) => {
  try {
    const beesInMyHive = await Hive.findById(req.hiveId).populate("users");

    if (!beesInMyHive) {
      return res
        .status(401)
        .send({ message: "There is no bee in the hive", success: false });
    }

    res.status(200).send({ success: true, beesInMyHive });
  } catch (err) {
    next(err);
  }
});

router.put("/updateprofile", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(400).send({ message: "user not registered" });
    }

    await user.update({ ...req.body })

    res.status(200).send({
      message: "User updated successfully",
      success: true,
    });
  } catch (err) {
    next(err);
  }

})

module.exports = router;
