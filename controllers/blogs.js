const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  response.json({ status: "ok" });
});

blogsRouter.get("/api/blogs", async (request, response) => {
  const blog = await Blog.find({});
  response.json(blog);
});

blogsRouter.get("/api/blogs/:id", async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    response.json("error", error);
  }
});

blogsRouter.post("/api/blogs", async (request, response) => {
  const body = request.body;

  const blog = new Blog({
    title: body.title,
    content: body.content,
    author: body.author,
    likes: body.likes,
    activity: body.activity,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const savedBlog = await blog.save();
  response.json(savedBlog);
});

blogsRouter.delete("/api/blogs/:id", async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    console.log("error: ", error);
  }
});

blogsRouter.put("/api/blogs/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    author: body.author,
    updatedAt: new Date(),
  };
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
