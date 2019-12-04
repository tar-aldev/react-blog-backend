const { model, Schema } = require("mongoose");
const TokenSchema = new Schema({
  refreshToken: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
});

/* TokenSchema.index(({ createdAt: 1 }, { expireAfterSeconds: 60 * 2 })); */
module.exports = model("token", TokenSchema);
