const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  response.json("asdasdasdasd");
});

blogsRouter.get("/api/blogs", async (request, response) => {
  const blog = await Blog.find({});
  response.json(blog);
});

blogsRouter.post("/api/blogs", async (request, response) => {
  const body = request.body;

  const blog = new Blog({
    title: body.title,
    content: body.content,
    author: body.author,
  });
  const savedBlog = await blog.save();
  response.json(savedBlog);
});

module.exports = blogsRouter;
