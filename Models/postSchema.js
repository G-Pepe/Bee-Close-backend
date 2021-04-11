const mongoose = require("mongoose");
//const CommentSchema = require("./CommentSchema");

const PostSchema = new mongoose.Schema({
  user: {ref:'Users', type: mongoose.Schema.Types.ObjectId, required: true },
  text: { type: String, required: true },
  image: {
    type: String,
    default:
      "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png",
  },
  timestamp: { type: Date, default: Date.now },
  categories: {
    type: String,
    Enum: ["general", "support", "miscellaneous"],
    default: "miscellaneous",
  },
  comments: [
    {
      author: { type: String },
      text: { type: String },
      timestamp: { type: Date, default: Date.now() },
      replies: [{}],
    },
  ],
});

module.exports = mongoose.model("Posts", PostSchema);
