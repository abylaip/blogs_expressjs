const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

loginRouter.post("/", async (request, response) => {
  const { body } = request;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    fullname: body.fullname,
    email: body.email,
    password: passwordHash,
  });
  await user.save();
  response.json(user);
});

loginRouter.post("/login", async (request, response, next) => {
  const { body } = request;

  const user = await User.findOne({ email: body.email });
  if (!user) {
    next(new Error("User not found!"));
    return;
  }
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(body.password, user.password);
  if (passwordCorrect) {
    const tokenData = {
      email: user.email,
      id: user._id,
      now: new Date(),
    };
    const token = jwt.sign(tokenData, process.env.SECRET);
    user.token = token;
    await user.save();
    response.json({ token });
  } else {
    response.status(401).json({ error: "Wrong password!" });
  }
});

module.exports = loginRouter;
