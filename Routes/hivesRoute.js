const express = require("express");
const router = express.Router();
const Hives = require("../Models/hiveSchema");

// creating/joining an hive
router.post("/joinhive/:userId", async (req, res, next) => {
  const { address } = req.body; // we can remove this line
  const { userId } = req.params;

  // TODO normalise / sanitise street
  try {
    const existingHive = await Hives.findOne({
      "address.street": req.body.address.street,
      "address.houseNumber": req.body.address.houseNumber,
      "address.postalCode": req.body.address.postalCode,
    });

    if (existingHive) {
      await existingHive.update({ $push: { users: userId } });

      console.log("existing hive", existingHive);

      return res.status(200).json("User successfully added to his hive");
    }

    await Hives.create({
      address: address,
      secretKey: "randomSecretKey",
      users: [userId],
      posts: [],
    });

    res
      .status(200)
      .send({ message: "Congratulation: you have created your hive" });
  } catch (err) {
    next(err);
  }
});

router.get("/findhive/:hiveId", async (req, res, next) => {
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
