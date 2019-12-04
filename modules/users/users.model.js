const bcrypt = require("bcrypt");
const { Schema, model } = require("mongoose");

const AvatarSchema = new Schema({
  fileName: { type: String, required: true },
  originalFileName: { type: String, required: true },
});

const UserSchema = new Schema(
  {
    gmailId: { type: String, required: false, default: null },
    email: { type: String, immutable: true, required: true },
    nickName: { type: String, required: true },
    /* If no gmailId was provided i.e password is required otherwise don't have password with social authentication */
    firstName: { type: String },
    lastName: { type: String },
    avatar: AvatarSchema,
    password: {
      type: String,
      select: false,
      required: function() {
        return !this.gmailId;
      },
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
/* 
UserSchema.virtual("posts", {
  ref: "post",
  localField: "_id",
  foreignField: "author",
  justOne: false,
}); */

UserSchema.method("comparePasswords", async function(userPassword) {
  if (this.password) {
    try {
      await bcrypt.compare(userPassword, this.password);
      return true;
    } catch (error) {
      console.log("ERROR COMPARE PASSWORDS", error);
      return false;
    }
  }
});

UserSchema.pre("save", async function(next) {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = model("user", UserSchema);
