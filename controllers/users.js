const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },

  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

usersRouter.get("/info", async (request, response, next) => {
  response.json(request.user);
});
var upload = multer({ storage: storage });
usersRouter.put(
  "/:id",
  upload.single("avatar"),
  async (request, response, next) => {
    const { body } = request;

    const user = await User.findById(request.params.id);

    if (!user) {
      next(new Error("Object not found!"));
      return;
    }
    const file = req.file;
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next("hey error");
    }
    user.avatar = file.path;
    user.set(body);
    await user.save();
    response.json(user);
  }
);

usersRouter.put("/password/:id", async (request, response, next) => {
  const { body } = request;

  const user = await User.findById(request.params.id);

  if (!user) {
    next(new Error("Object not found!"));
    return;
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);
  body.password = passwordHash;
  user.set(body);
  await user.save();
  response.json(user);
});

// usersRouter.get("/info/:id", async (request, reponse, next) => {
//   try {
//     const user = await User.findById(request.params.id);
//     if (user) {
//       response.json(user);
//     } else {
//       response.status(404).end();
//     }
//   } catch (error) {
//     response.json("error", error);
//   }
// });

module.exports = usersRouter;
