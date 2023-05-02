const mongoose = require("mongoose");
const { Schema } = mongoose;

const posts = new Schema({
  dateOfTheScrape: String,
  nameOfPoster: String,
  postLink: String,
  postContent: String,
  numberOfLikes: String,
  postImage: String,
  timeOfPost: String,
  // numberOfShares: String,
  // postSentiment: String,
  comments: [
    {
      commentContent: String,
      commenterName: String,
      commentorId: String,
      commentSentiment: String,
    },
  ],
  date: String,
});

const Posts = mongoose.model("Posts", posts);

module.exports = Posts;
