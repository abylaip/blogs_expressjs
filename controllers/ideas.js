const ideasRouter = require("express").Router();
const Idea = require("../models/idea");
const nodemailer = require("nodemailer");
const { json } = require("express");

ideasRouter.get("/all", async (request, response, next) => {
  const ideas = await Idea.find({})
    .populate("createdBy")
    .populate("connectedUsers", "fullname");
  response.json(ideas);
});

ideasRouter.get("/", async (request, response) => {
  const idea = await Idea.find({ createdBy: request.user._id }).populate(
    "createdBy"
  );
  response.json(idea);
});

async function sendEmail(idea, user) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ideasharring@gmail.com", // generated ethereal user
      pass: "Qqwerty1!", // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: "ideasharring@gmail.com", // sender address
    to: user.email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: `Successfully joined ${idea.title}`, // plain text body
    //html: "<b>Hello world?</b>" // html body
  });

  console.log("Message sent: %s", info.messageId);
}

ideasRouter.get("/idea/:id/connect", async (request, response) => {
  const idea = await Idea.findById(request.params.id);
  if (!idea) {
    return json.status(404).json({ error: "idea not found" });
  }

  const { user } = request;
  let alreadyJoined = false;
  for (let i = 0; i < idea.connectedUsers.length; ++i) {
    if (idea.connectedUsers[i].toString() === user._id.toString()) {
      alreadyJoined = true;
      break;
    }
  }
  if (!alreadyJoined) {
    idea.connectedUsers.push(user._id);
    await idea.save();
  }

  await sendEmail(idea, user);

  response.json("Connected");
});

ideasRouter.get("/:id", async (request, response) => {
  try {
    const idea = await Idea.findById(request.params.id);
    if (idea) {
      response.json(idea);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    response.json("error", error);
  }
});

ideasRouter.post("/", async (request, response) => {
  const body = request.body;

  const { user } = request;
  const idea = new Idea({
    title: body.title,
    content: body.content,
    author: user.fullname,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: user._id,
  });
  const savedIdea = await idea.save();
  response.json(savedIdea);
});

ideasRouter.delete("/:id", async (request, response) => {
  try {
    await Idea.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    console.log("error: ", error);
  }
});

ideasRouter.put("/:id", async (request, response, next) => {
  const { body } = request;

  const idea = await Idea.findById(request.params.id);

  if (!idea) {
    next(new Error("Object not found!"));
    return;
  }

  idea.set(body);
  await idea.save();
  response.json(idea);
});

module.exports = ideasRouter;
