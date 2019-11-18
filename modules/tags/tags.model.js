const { Schema, model } = require("mongoose");

const TagSchema = new Schema({
  name: { type: String, required: true },
});

module.exports = model("tag", TagSchema);
