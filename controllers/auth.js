const User = require("../models/user");
const jwt = require("jsonwebtoken");
const utils = require("../utils/index.js");

const authRouter = async (request, response, next) => {
  try {
    const token = utils.getTokenFrom(request);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }
    const user = await User.findById(decodedToken.id);
    request.user = user;
    await next();
  } catch (e) {
    return response.status(401).json({ error: e.message });
  }
};
module.exports = authRouter;
