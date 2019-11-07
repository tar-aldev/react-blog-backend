const bcrypt = require("bcrypt");
const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  gmailId: { type: String, required: false, default: null },
  nickName: { type: String, required: true },
  email: { type: String, required: true },
  /* If no gmailId was provided i.e password is required otherwise don't have password with social authentication */
  password: {
    type: String,
    select: false,
    required: function() {
      return !this.gmailId;
    },
  },
});

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
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  }
  next();
});

module.exports = model("user", UserSchema);
