const express = require("express");
const mongoose = require("mongoose");
const blogsRouter = require("./controllers/blogs");
const cors = require("cors");
const app = express();

mongoose
  .connect(
    `mongodb+srv://fullstack:12345@cluster0.ssypy.mongodb.net/reblogs?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then((result) => {
    console.log("connected to database");
  });

app.use(cors);
app.use(express.json);
app.use("/", blogsRouter);
module.exports = app;
