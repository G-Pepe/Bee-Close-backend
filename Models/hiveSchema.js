const mongoose = require("mongoose");

const HiveSchema = new mongoose.Schema({
  address: {
    street: { type: String, required: true },
    houseNumber: { type: String, required: true },
    postalCode: { type: String, required: true },
    city: { type: String },
  },
  secretKey: { type: String, required: true },
  // creating the reference/link between hives and users (one-to-many) and hive and posts (one-to-many)
  users: [{ ref: "Users", type: mongoose.Schema.Types.ObjectId }],
  posts: [{ ref: "Posts", type: mongoose.Schema.Types.ObjectId }],
});

module.exports = mongoose.model("Hives", HiveSchema);
