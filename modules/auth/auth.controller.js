const User = require("../users/users.model");
const {
  signJWT,
  getUrlGoogle,
  getGoogleAccountByCode,
  generateNickname,
} = require("../../utils/index");

/*
  acces token - short term of expiration short validity period
  refresh token - used to generate access token.
  Used only once - after this old refresh token is deleted and new one is generated
*/

const generateTokens = userId => {
  const accessToken = signJWT(
    { _id: userId },
    process.env.ACCESS_TOKEN_SECRET,
    process.env.ACCESS_TOKEN_EXP
  );
  const refreshToken = signJWT(
    {},
    process.env.REFRESH_TOKEN_SECRET,
    process.env.REFRESH_TOKEN_EXP
  );
  return {
    accessToken,
    refreshToken,
  };
};

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
    const tokens = generateTokens(foundUser._id);
    const refreshToken = new Token({
      refreshToken: tokens.refreshToken,
      userId: foundUser._id,
    });

    console.log("refreshToken", refreshToken);
    try {
      await refreshToken.save();
      res.status(200).json({ message: "Signed in", ...tokens });
    } catch (err) {
      res.json({ message: "Cannot sign in" });
    }
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
    /* let user = await User.findOne({
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

  refreshToken: async (req, res) => {
    const { refreshToken } = req.body;
    try {
      const foundToken = await Token.findOne({
        refreshToken,
      }).exec();
      if (!!foundToken) {
        const { _id, userId } = foundToken;
        const newTokensPair = generateTokens(userId);

        const newRefreshToken = new Token({
          userId,
          refreshToken: newTokensPair.refreshToken,
        });

        await newRefreshToken.save();
        await Token.findByIdAndDelete(_id).exec();

        return res
          .status(200)
          .json({ message: "token refeshed!", ...newTokensPair });
      }
      return res.status(401).json({ message: "Invalid refresh token" });
    } catch (error) {
      console.log("error TOKEN FIND AND DELETE", error);
      return res.status(500).json({ message: "Cannot refresh token" });
    }
  },
  revokeToken: async (req, res, next) => {
    const { refreshToken } = req.body;
    try {
      await Token.findOneAndDelete({ refreshToken }).exec();
      return res.status(401).json({ message: "Successfully revoked token" });
    } catch (error) {
      console.log("error TOKEN FIND AND DELETE", error);
      return res.status(500).json({ message: "Cannot revoke token" });
    }
  },
};
