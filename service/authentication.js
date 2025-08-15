const JWT = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;

function genrateTokenForUser(user) {
  let payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
    profileImage: user.profileImage,
    role: user.role,
  };
  return JWT.sign(payload, secret, { expiresIn: "3d" });
}

function verifyToken(token) {
  return JWT.verify(token, secret);
}

module.exports = { genrateTokenForUser, verifyToken };
