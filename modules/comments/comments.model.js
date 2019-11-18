const { Schema, model } = require("mongoose");

const CommentSchema = new Schema(
  {
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "user", required: true },
    post: { type: Schema.Types.ObjectId, ref: "post", required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = model("comment", CommentSchema);
