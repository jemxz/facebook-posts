const puppeteer = require("puppeteer");
const login = require("./middlewares/login");
const createPosts = require("./core-scraper/post-scraper");
const Posts = require("./model/posts-model");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose
  .connect("mongodb://localhost/facebook-data", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log(err.message));

app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

async function createGroupsCollection() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      "--disable-notifications",
      "--disable-dev-shm-usage",
      "--no-sandbox",
    ],
  });

  const page = await browser.newPage();
  console.log("Launching Page");
  page.setDefaultNavigationTimeout(100000);
  console.log("Authenticated proxy");

  // LOGING IN TO A FACEBOOK ACCOUNT --- //
  try {
    console.log("Logging in");
    await login(page);
  } catch (error) {
    return console.log(error.message);
  }

  const result = await createPosts(page);
  console.log(result);
  const posts = new Posts({
    posts: result,
  });
  await posts.save();

  browser.close();
}

createGroupsCollection();
