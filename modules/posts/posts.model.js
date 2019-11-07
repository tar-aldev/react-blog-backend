const bcrypt = require("bcrypt");
const { Schema, model } = require("mongoose");

const PostSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    title: { type: String, required: true },
    body: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
module.exports = model("post", PostSchema);
