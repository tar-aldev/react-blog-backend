const Post = require("./posts.model");
// const service = require("./posts.service");
// Calculate posts amount

module.exports = {
  getAll: async (req, res) => {
    try {
      const posts = await Post.find().populate("author tags");
      console.log("posts", posts);
      res.status(200).json({ posts });
    } catch (error) {
      console.log("error", error);
    }
  },
  getOne: async (req, res) => {
    const { id } = req.params;
    try {
      const post = await Post.findById(id).populate("author tags");
      res.status(200).json({ post });
    } catch (error) {}
  },
  addOne: async (req, res) => {
    try {
      const author = req.jwtPayload._id;
      const newPost = new Post({ ...req.body, author });
      const post = await newPost.save();
      res.status(201).json({ message: "post created", post });
    } catch (error) {
      res.status(500).json({ message: "Cannot create post", error });
    }
  },
  update: (req, res) => {},
};
