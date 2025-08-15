const { Schema, model } = require("mongoose");
const { randomBytes, createHmac } = require("crypto");
const { genrateTokenForUser } = require("../service/authentication");
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  salt: { type: String },
  profileImage: { type: String, default: "/img/user.png"},
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  password: { type: String, required: true },
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  const salt = randomBytes(16).toString("hex");;
  const hashedPassword = createHmac("sha256", salt)
    .update(this.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashedPassword;
  next();
});

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found");
  const salt = user.salt;
  const hashedPassword = user.password;
  const userProvidedHashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  if (hashedPassword !== userProvidedHashedPassword)
    throw new Error("Invalid password");
  const token = genrateTokenForUser(user);
  return token;
});

module.exports = model("user", userSchema);
