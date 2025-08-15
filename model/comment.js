const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
    content: { type: String, rquired: true },
    blogId: { type: Schema.Types.ObjectId, ref: "blog" },
    createdBy: { type: Schema.Types.ObjectId, ref: "user" }
}, { timestamps: true });

module.exports = model("comment", commentSchema);