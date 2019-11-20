const Post = require("./posts.model");
const User = require("../users/users.model");
// const service = require("./posts.service");
// Calculate posts amount

const searchPostsByAuthor = async ({ skip, limit, searchStr, searchBy }) => {
  const users = await User.find({
    nickName: new RegExp(searchStr, "i"),
  }).exec();
  const usersIds = users.map(user => user._id);

  const total = await Post.countDocuments({ author: { $in: usersIds } });
  const posts = await Post.find({ author: { $in: usersIds } }, null, {
    sort: { title: "asc" },
    skip: Number(skip),
    limit: Number(limit),
  }).populate("author tags");

  return { total, posts };
};

module.exports = {
  getPaginated: async (req, res) => {
    const {
      query: { skip, limit, searchStr, searchBy },
    } = req;
    try {
      if (searchBy === "author") {
        const { posts, total } = await searchPostsByAuthor({
          skip,
          limit,
          searchStr,
          searchBy,
        });
        return res.status(200).json({ posts, total });
      }
      let queryConditions = {};
      if (searchBy === "title") {
        queryConditions = { title: new RegExp(searchStr, "i") };
      }
      const posts = await Post.find(queryConditions, null, {
        sort: { title: "asc" },
        skip: Number(skip),
        limit: Number(limit),
      }).populate("author tags");

      res.status(200).json({ posts, total: 0 });
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
