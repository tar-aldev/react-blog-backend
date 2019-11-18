const User = require("../users/users.model");
const {
  signJWT,
  getUrlGoogle,
  getGoogleAccountByCode,
  generateNickname,
} = require("../../utils/index");

module.exports = {
  signin: async (req, res) => {
    console.log("SIGN IN PLAIN");
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email })
      .select("+password")
      .exec();

    if (!foundUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordCorrect = await foundUser.comparePasswords(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = signJWT({ _id: foundUser._id });
    res.status(200).json({ message: "Signed in", token });
  },
  googleSignin: async (req, res) => {
    const { code } = req.body;
    const accountInfo = await getGoogleAccountByCode(code);
    const userGmailId = accountInfo.resourceName.replace("people/", "");
    console.log("accountInfo", accountInfo);

    /* If we signin in with google but already have user with such email return error */
    let userByEmail = await User.findOne({
      email: accountInfo.emailAddresses[0].value,
    });
    if (userByEmail) {
      return res.status(500).json({
        message:
          "You already have an account. Please sign in using email and password",
      });
    }
    let user = await User.findOne({
      gmailId: userGmailId,
    });
    /* if (!user) {
      const newUser = new User({
        gmailId: userGmailId,
        nickName: accountInfo.nicknames
          ? accountInfo.nicknames[0]
          : generateNickname(accountInfo.names[0].displayName),
        email: accountInfo.emailAddresses[0].value,
      });
      user = await newUser.save();
    }
    const token = signJWT({ _id: user._id });
    res.status(200).json({ message: "Signed in", token }); */
  },
  googleSigninUrl: async (req, res) => {
    try {
      const url = getUrlGoogle();
      res.status(200).json({ googleLoginUrl: url });
    } catch (error) {
      console.log("GET GOOGLE LOGIN URL ERROR:", error);
    }
  },
};
