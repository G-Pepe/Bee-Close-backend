const express = require("express");
const Posts = require("../Models/postSchema");
const Users = require("../Models/userSchema");
const Hives = require("../Models/hiveSchema");
const router = express.Router();

// adding a new post
router.post("/newpost/:hive_id", async (req, res, next) => {
  const { hive_id } = req.params;

  try {
    const user = await Users.findById(req.body.user_id);

    if (!user) {
      throw "User not found";
    }

    const post = await Posts.create(req.body);

    const hiveToUpdate = await Hives.findById(hive_id);

    if (!hiveToUpdate) {
      throw "Hive not found";
    }

    await hiveToUpdate.update({
      $push: { posts: post._id },
    });

    res.status(200).send({ success: true, post });
  } catch (err) {
    const error = new Error(err);
    next(error);
  }
});

// getting all existing posts
router.get("/", async (req, res, next) => {
  try {
    let allPosts = await Posts.find({});
    res.status(200).send({ success: true, allPosts });
  } catch (err) {
    next(err);
  }
});

// updating/modifying one single post

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const comment = await Posts.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).send({ success: true, comment });
  } catch (err) {
    next(err);
  }
});

// deleting one single post
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const PostDeleted = await Posts.findByIdAndRemove(id);
    if (PostDeleted) {
      res.status(200).send({ success: true, PostDeleted });
    } else {
      res.status(200).send("Post not existing or already deleted");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
