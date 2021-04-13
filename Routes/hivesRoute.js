const express = require("express");
const router = express.Router();
const Hives = require("../Models/hiveSchema");
const Users = require("../Models/userSchema");
const auth = require("../Middlewares/authJwt");
// creating/joining an hive
router.post("/joinhive/:userId", async (req, res, next) => {
  const { userId } = req.params;
  // TODO normalise / sanitise street
  try {
    const user = await Users.findOne({
      _id: userId,
    });

    if(!user) {
      throw 'User not found';
    }

    const existingHive = await Hives.findOne({
      "address.street": user.street,
      "address.houseNumber": user.houseNumber,
      "address.postalCode": user.postalCode,
    });
    if (existingHive) {
      await existingHive.update({ $push: { users: userId } });
      console.log("existing hive", existingHive);
      return res
        .status(200)
        .send({
          message: "User successfully added to his hive",
          success: true,
        });
    }
    await Hives.create({
      address: {
        street: user.street,
        houseNumber: user.houseNumber,
        postalCode: user.postCode,
        city: user.city
      },
      secretKey: "randomSecretKey",
      users: [userId],
      posts: [],
    });
    res
      .status(200)
      .send({
        message: "Congratulation: you have created your hive",
        success: true,
      });
  } catch (err) {
    res.status(500).send({ message: err });
  }
});
router.get("/findhive/:hiveId", auth, async (req, res, next) => {
  const { hiveId } = req.params;
  try {
    const singleHive = await Hives.findById(hiveId)
      .populate(
        "users",
        "-_id -__v -password -email -lastName -city -streetNumber -street -postCode -gender"
      )
      .populate("posts", "-id -timestamp");
    if (singleHive) {
      res.status(200).send({ success: true, singleHive });
    }
  } catch (err) {
    next(err);
  }
});
module.exports = router;