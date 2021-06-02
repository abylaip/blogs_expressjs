const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const ideasRouter = require("./controllers/ideas");
const loginRouter = require("./controllers/login");
const usersRouter = require("./controllers/users");
const authRouter = require("./controllers/auth");
const cors = require("cors");
const app = express();

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("connected to database");
  });

app.use(cors());
app.use(express.json());
app.use("/api/auth", loginRouter);
app.use(authRouter);
app.use("/api/users", express.static(__dirname + "/:id"), usersRouter);
app.use("/api/ideas", ideasRouter);
module.exports = app;
