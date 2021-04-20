const mongoose = require("mongoose");
const { encrypt } = require("../lib/encryption");

// creating the schema for the user
// add hive id into schema
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  street: { type: String, required: true },
  country: { type: String },
  city: { type: String },
  houseNumber: { type: String, required: true },
  postCode: { type: String, required: true },
  photo: { type: String, url: "https://picsum.photos/seed/picsum/200/300" },
  dateOfBirth: { type: Date },
  phoneNumber: { type: String },
  gender: { type: String, enum: ["Male", "Female", "N/A"], default: "N/A" },
  hiveId: {
    ref: "Hives",
    type: mongoose.Schema.Types.ObjectId,
  },
});

// hashing password just before storing into database
UserSchema.pre("save", function (next) {
  const user = this;
  //to make sure we don't update or hash password if this was not modified
  if (!user.isModified("password")) return next();

  user.password = encrypt(user.password);
  next();
});

module.exports = mongoose.model("Users", UserSchema);
