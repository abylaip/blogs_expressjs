const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const { body } = request;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    ...body,
    password: passwordHash,
  });
  await user.save();
  response.json(user);
});

usersRouter.post("/login", async (request, response, next) => {
  const { body } = request;

  const user = await User.findOne({ username: body.username });
  if (!user) {
    next(new Error("User not found!"));
    return;
  }
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(body.password, user.password);
  if (passwordCorrect) {
    const tokenData = {
      username: user.username,
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

module.exports = usersRouter;

//   const token = jwt.sign(userForToken, process.env.SECRET)

//   response
//     .status(200)
//     .send({ token, username: user.username, name: user.name })
// })

// module.exports = loginRouter
