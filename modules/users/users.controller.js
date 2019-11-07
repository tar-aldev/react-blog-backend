const User = require("./users.model");
const { signJWT } = require("../../utils");

module.exports = {
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
      const newUser = new User(req.body);
      const user = await newUser.save();
      const token = signJWT({ _id: user._id });
      res.status(201).json({ message: "Signed up", token });
    } catch (error) {
      console.log(error, "ERROR CREATE USER");
      res.status(500).json({ message: "Cannot create user", error });
    }
  },
  update: (req, res) => {},
};
