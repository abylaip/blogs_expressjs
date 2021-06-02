const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  education: {
    type: String,
  },
  email: {
    type: String,
    reqiured: true,
  },
  location: {
    type: String,
  },
  skills: {
    type: String,
  },
  position: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("User", userSchema);
