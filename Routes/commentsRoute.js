const express = require("express");
const router = express.Router();
const Posts = require("../Models/postSchema");

// adding comment to a post
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Posts.findById(id);

    if (!post) {
      throw "Post ID not found";
    }

    console.log(req.body);
    post.comments = [...post.comments, req.body];
    const save = await post.save();

    if (!save) {
      throw "Error saving";
    }

    res.status(200).send({ success: true, post });
  } catch (err) {
    res.status(500).send({ success: false, message: err });
  }
});

// adding replies to a post
router.put("/replies/:id", async (req, res, next) => {
  const { id } = req.params;
  const commentId = req.body.id;
  const reply = req.body.reply;

  console.log("reply", reply);

  try {
    // Using $push operator to append the reply to the specific comments-array.
    const post = await Posts.findOneAndUpdate(
      { _id: id, "comments._id": commentId },
      { $push: { "comments.$.replies": reply } }
    );

    console.log(post);

    res.status(200).json("replied successfully added");
  } catch (err) {
    res.status(500).send({ success: false, message: err });
  }
});

module.exports = router;

// this was our first add-comment-endPoint

/*   await Posts.findById(id)
    .then((post) => {
      console.log(req.body);
      post.comments = [...post.comments, req.body];
      post.save();
      res.status(200).send({ success: true, post });
      next();
    })
    .catch((err) => {
      next(err);
    }); */

// this was our first add-reply-endPoint
/* await Posts.findById(id)
    .then((post) => {
      console.log(post);
      let newComment = post.comments.filter((x) => x._id == req.body.id)[0];
      newComment.replies = [...newComment.replies, req.body.reply];
      console.log(newComment);
      let allComments = post.comments.filter((x) => x._id != req.body.id);
      allComments.push(newComment);
      console.log(allComments);
      post.comments = allComments;
      post
        .save()
        .then(() => {
          res.status(200).json("replied successfully added");
        })
        .catch(() => {});

      next();
    })
    .catch((err) => {
      next(err);
    }); */
