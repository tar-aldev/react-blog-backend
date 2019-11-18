const { Schema, model } = require("mongoose");

const PostSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    title: { type: String, required: true },
    abstract: { type: String },
    encodedBody: { type: String, required: true },
    plainStringBody: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "tag", required: true }],
    likes: { type: String, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = model("post", PostSchema);
