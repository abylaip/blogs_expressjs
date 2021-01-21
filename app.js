const express = require("express");
const mongoose = require("mongoose");
const blogsRouter = require("./controllers/blogs");
const cors = require("cors");
const app = express();

mongoose
  .connect(
    process.env.DATABASE_URL,
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

app.use(cors());
app.use(express.json());
app.use("/", blogsRouter);
module.exports = app;
