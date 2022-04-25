const express = require("express");
const Reporter = require("../models/reporters");
const router = express.Router();
const auth = require("../middleware/auth");

// Sing up
router.post("/signup", async (req, res) => {
  try {
    const reporter = new Reporter(req.body);
    const token = await reporter.generateToken();
    await reporter.save();
    res.status(200).send({ reporter, token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});
// Upload img
const uploads = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.img.match(/\.(jpg|jpeg|png|jfif)$/)) return cb(null, false);
    cb(null, true);
  },
});
router.post(
  "/add/image/reporter",
  auth,
  uploads.single("image"),
  async (req, res) => {
    try {
      req.reporter.image = req.file.buffer;
      await req.reporter.save();
      res.send();
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);
// log in
router.post("/login", async (req, res) => {
  try {
    const reporter = await Reporter.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await reporter.generateToken();
    res.status(200).send({ reporter, token });
  } catch (err) {
    res.status(err).send(e.message);
  }
});

// log out
router.delete("/logout", auth, async (req, res) => {
  try {
    req.reporter.tokens = req.reporter.tokens.filter((eo) => {
      return eo !== req.token;
    });
    await req.reporter.save();
    res.status(200).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});
//porfile
router.get("/profile", auth, async (req, res) => {
  res.send(req.reporter);
});

//update user
router.patch("/reporter", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const reporter = await Reporter.findById(req.reporter._id);
    if (!reporter) {
      return res.status(400).send("reporter is not found");
    }
    updates.forEach((eo) => (reporter[eo] = req.body[eo]));
    await reporter.save();
    res.status(200).send(reporter);
  } catch (err) {
    res.status(400).send(err);
  }
});

// delet user
router.delete("/reporter", auth, async (req, res) => {
  try {
    const reporter = await Reporter.findByIdAndDelete(req.reporter._id, {
      new: true,
      runValidators: true,
    });
    if (!reporter) {
      return res.status(400).send("reporter is falss");
    }
    res.status(200).send(reporter);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
