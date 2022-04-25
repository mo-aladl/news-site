const express = require("express");
const router = express.Router();
const Article = require("../models/artical");
const auth = require("../middleware/auth");

/*
add  article
*/
router.post("/add/article", auth, async (req, res) => {
  try {
    const article = new Article({ ...req.body, reporter: req.reporter._id });
    await article.save();
    res.status(200).send(article);
  } catch (err) {
    res.status(400).send(err);
  }
});

const uploads = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.img.match(/\.(jpg|jpeg|png|jfif)$/)) return cb(null, false);
    cb(null, true);
  },
});
/*

add  image

*/

router.post("/image/:id", auth, uploads.single("image"), async (req, res) => {
  try {
    const id = req.params.id;
    const article = await Article.findById({ _id: id });
    article.image = req.file.buffer;
    await article.save();
    res.send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});
//returning
router.get("/return/articles", auth, async (req, res) => {
  try {
    await req.reporter.populate("articles");
    res.status(200).send(req.reporter.articles);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//update
router.patch("/update/article/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const article = await Article.findOneAndUpdate(
      { _id: id, reporter: req.reporter._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    console.log(article);
    if (!article) {
      return res.status(400).send("article is not found");
    }
    res.status(200).send(article);
  } catch (err) {
    res.status(500).send(err);
  }
});

// delete
router.delete("/delete/article/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const article = await Article.findOneAndDelete(
      { _id: id, reporter: req.reporter._id },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!article) {
      return res.status(400).send("article is not found");
    }
    res.status(200).send(article);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
