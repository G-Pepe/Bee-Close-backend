const mongoose = require("mongoose");
//const CommentSchema = require("./CommentSchema");

const PostSchema = new mongoose.Schema({
  user: { ref: "Users", type: mongoose.Schema.Types.ObjectId, required: true },
  text: { type: String, required: true },
  image: { type: String },
  timestamp: { type: Date, default: Date.now },
  category: {
    type: String,
    Enum: ["regular", "event", "giveaway"],
    default: "regular",
  },
  comments: [
    {
      author: { type: String },
      text: { type: String },
      timestamp: { type: Date, default: Date.now() },
      replies: [{}],
    },
  ],
  hiveId: {
    ref: "Hives",
    type: mongoose.Schema.Types.ObjectId,
  },
});

module.exports = mongoose.model("Posts", PostSchema);
