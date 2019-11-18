const Tag = require("./tags.model");
const { signJWT } = require("../../utils");

module.exports = {
  getAll: async (req, res) => {
    try {
      const tags = await Tag.find();
      res.status(200).json({ tags });
    } catch (error) {
      res.status(500).json({ message: "Cannot fetch tags", error });
    }
  },
  getOne: (req, res) => {},
  addOne: async (req, res) => {
    try {
      const foundTag = await Tag.findOne({ name: req.body.name });
      if (foundTag) {
        return res.status(500).json({ message: "Tag already exists" });
      }
      const newTag = new Tag(req.body);
      const tag = await newTag.save();
      res.status(201).json({ message: "Tag created", tag });
    } catch (error) {
      console.log(error, "ERROR CREATE USER");
      res.status(500).json({ message: "Cannot create tag", error });
    }
  },
  update: (req, res) => {},
};
