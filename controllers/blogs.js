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
      reponse.json(blog);
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
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const savedBlog = await blog.save();
  response.json(savedBlog);
});

blogsRouter.delete("/api/blogs/:id", async (request, response) => {
  try {
    const blog = await Blog.findByIdAndRemove(request.params.id);
    reponse.status(200).end();
  } catch (error) {
    console.log("error: ", error);
  }
});

blogsRouter.put("/api/blogs/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    content: body.content,
    author: body.author,
    updatedAt: new Date(),
  };
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.status(updatedBlog);
});

module.exports = blogsRouter;
