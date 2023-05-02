const scrollToBottom = require("../middlewares/auto-scroll");
const Posts = require("../model/posts-model");
const getLink = require("./link-scraper");
const getImage = require("./img-scraper");
const getText = require("./text-scraper");
const fs = require("fs");
const log = require("log-to-file");

var date = new Date().toLocaleString();

// const target = fs.readFileSync("/home/osint/Desktop/osint/Facebook/faceboook-scraper-backend/target.txt", "utf-8").split("\n");
const target = fs.readFileSync("./target.txt", "utf-8").split("\n");
const ids = "https://facebook.com/" + target;

module.exports = async function createGroups(page) {
  const result = [];

  // NAVIGATION AND SCROLING TO THE DESIRED PAGE //
  try {
    await page.goto(ids);
    await page.waitForTimeout(1000);
    console.log("navigation succesfull");
    await page.waitForTimeout(1000);
    await scrollToBottom(page);
    await page.waitForTimeout(1000);
    console.log("scrolling success");
  } catch (error) {
    return console.log(error.message);
  }

  // Selectors for All thing relate to posts

  const postLink_selector =
    ".x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.x1heor9g.xt0b8zv.xo1l8bm";
  const postContent_selector =
    ".xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x1vvkbs.x126k92a";
  const postImage_selector =
    ".x1ey2m1c.xds687c.x5yr21d.x10l6tqk.x17qophe.x13vifvy.xh8yej3.xl1xv1r";
  const postLikes_selector = ".xrbpyxo.x6ikm8r.x10wlt62.xlyipyv.x1exxlbk";
  const timeOfPost_selector =
    ".x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.x1heor9g.xt0b8zv.xo1l8bm";

  ///////////////////////////////////// Scraping all things releated to posts  ////////////////////////////////////////////////////////////////////////////////
  const postLinks = await getLink(postLink_selector, page);
  // Scraping for all post Content //
  const posts = await getText(postContent_selector, page);
  // Scraping for all post Images
  const postImages = await getImage(postImage_selector, page);
  // Scraping for all post Likes
  const postLikes = await getText(postLikes_selector, page);
  // Scraping for all posts Time of Post
  const timeOfPost = await getText(timeOfPost_selector, page);

  for (let i = 0; i < posts.length; i++) {
    result.push({
      dateOfTheScrape: date,
      nameOfPoster: target,
      postLink: postLinks[i],
      postContent: posts[i],
      numberOfLikes: postLikes[i],
      postImage: postImages[i],
      timeOfPost: timeOfPost[i],
      numberOfComments: "",
      numberOfShares: "",
      postSentiment: "",
      comments: [
        {
          commentContent: "",
          commenterName: "",
          commentorId: "",
          commentSentiment: "",
        },
      ],
    });
  }
  return result;
};
