const User = require("./users.model");
const { signJWT } = require("../../utils");

module.exports = {
  getCurrentUser: async (req, res) => {
    const { _id } = req.jwtPayload;
    try {
      const me = await User.findById(_id).exec();
      res.status(200).json({ me });
    } catch (error) {
      res.status(500).json({ message: "Cannot fetch users", error });
    }
  },
  getAll: async (req, res) => {
    try {
      const users = await User.find().exec();
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ message: "Cannot fetch users", error });
    }
  },
  getOne: (req, res) => {},
  addOne: async (req, res) => {
    try {
      const foundUser = await User.findOne({ email: req.body.email });
      if (foundUser) {
        return res
          .status(500)
          .json({ message: "User with such email already exists" });
      }
      const newUser = new User(req.body);
      const user = await newUser.save();
      const token = signJWT({ _id: user._id });
      res.status(201).json({ message: "Signed up", token });
    } catch (error) {
      console.log(error, "ERROR CREATE USER");
      res.status(500).json({ message: "Cannot create user", error });
    }
  },
  update: async (req, res) => {
    let update = req.body;
    let multerError = req.multerError;
    if (multerError) {
      return res.status(400).json({ message: multerError });
    }
    if (req.file) {
      update.avatar = {
        fileName: req.file.filename,
        originalFileName: req.file.originalname,
      };
    }

    const { _id } = req.jwtPayload;
    try {
      const profile = await User.findByIdAndUpdate(_id, update).exec();
      return res.status(201).json({ message: "Updated", profile });
    } catch (error) {
      return res.status(500).json({ message: "Cannot update profile" });
    }
  },
};
