const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blog = await Blog.find({ createdBy: request.user._id }).populate(
    "createdBy"
  );
  response.json(blog);
});

blogsRouter.get("/:id", async (request, response) => {
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

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  const { user } = request;
  const blog = new Blog({
    title: body.title,
    content: body.content,
    author: body.author,
    likes: body.likes,
    activity: body.activity,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: user._id,
  });
  const savedBlog = await blog.save();
  response.json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    console.log("error: ", error);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const { body } = request;

  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    next(new Error("Object not found!"));
    return;
  }

  blog.set(body);
  await blog.save();
  response.json(blog);
});

module.exports = blogsRouter;
