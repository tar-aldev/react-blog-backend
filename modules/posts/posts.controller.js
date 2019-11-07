const Post = require("./posts.model");
// const service = require("./posts.service");
// Calculate posts amount

module.exports = {
  getAll: async (req, res) => {
    try {
      const posts = await Post.find();

      console.log("posts", posts);
      res.status(201).json({ posts });
    } catch (error) {
      console.log("error", error);
    }
  },
  getOne: async (req, res) => {
    const { id } = req.params;
    try {
      const post = await Post.findById(id).exec();
      res.status(200).json({ message: "post created", post });
    } catch (error) {}
  },
  addOne: async (req, res) => {
    try {
      const newPost = new Post(req.body);
      const post = await newPost.save();
      res.status(201).json({ message: "post created", post });
    } catch (error) {
      console.log("SAVE POST ERROR", error);
      res.status(500).json({ message: "Cannot create post", error });
    }
  },
  update: (req, res) => {},
};
