const express = require("express");
const Posts = require("../Models/postSchema");
const Users = require("../Models/userSchema");
const Hives = require("../Models/hiveSchema");
const router = express.Router();
const auth = require("../Middlewares/authJwt");

// adding a new post
router.post("/newpost", auth, async (req, res, next) => {
  try {
    const user = await Users.findById(req.userId); // get user id from token

    if (!user) {
      throw "User not found";
    }

    const post = await Posts.create({
      user: req.userId,
      text: req.body.text,
      category: req.body.category,
      comments: [],
      hiveId: req.hiveId,
    });

    const hiveToUpdate = await Hives.findById(req.hiveId);

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

// getting all existing posts based on hiveId
router.get("/:type", auth, async (req, res, next) => {
  console.log(req.hiveId);
  console.log(req.userId);
  //const hive = await Hives.findById(req.hiveId).populate("posts");

  try {
    const posts = await Posts.find({ hiveId: req.hiveId }).populate("user");

    let allPosts = posts.filter((item) => item.category === req.params.type);

    res.status(200).send({ success: true, allPosts });
  } catch (err) {
    next(err);
  }
});

// get single post router
router.get("/getsinglepost/:id", auth, async (req, res, next)=> {
  const { id } = req.params;
  try {
    const post = await Posts.findById(id);
    res.status(200).send({ success: true, post });
  } catch (err) {
    next(err);
  }
})

// updating/modifying one single post

router.put("/:id", auth, async (req, res, next) => {
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
router.delete("/:id", auth, async (req, res, next) => {
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
