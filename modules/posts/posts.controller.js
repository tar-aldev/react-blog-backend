const Post = require("./posts.model");
const User = require("../users/users.model");
const qs = require("qs");
const _ = require("lodash");
// const service = require("./posts.service");
// Calculate posts amount

const getPaginatedPosts = async queryParams => {
  const {
    skip,
    limit,
    searchBy,
    searchStr,
    date: createdAt = "desc", // always get newer posts first
    postedByMe,
    tags = [],
  } = qs.parse(queryParams);

  let options = {
    skip: Number(skip),
    limit: Number(limit),
  };
  let conditions = {};
  if (searchBy === "author") {
    /* Find authors first */
    const users = await User.find({
      nickName: new RegExp(searchStr, "i"),
    }).exec();
    const usersIds = users.map(user => user._id);
    conditions = { ...conditions, author: { $in: usersIds } };
  } else {
    conditions = { ...conditions, title: new RegExp(searchStr, "i") };
  }

  if (tags.length > 0) {
    conditions = { ...conditions, tags: { $all: tags } };
  }

  options = { sort: { createdAt }, ...options };
  const total = await Post.countDocuments(conditions);
  const posts = await Post.find(conditions, null, options).populate(
    "author tags"
  );
  return { total, posts };
};

module.exports = {
  getPaginated: async (req, res) => {
    const { jwtPayload } = req;
    try {
      // const response = await getPaginatedPosts(req.query);
      const {
        skip,
        limit,
        searchBy,
        searchStr,
        date: createdAt = "desc", // always get newer posts first
        postedByMe,
        tags = [],
      } = qs.parse(req.query);

      let postedByMeBool = postedByMe === "true";
      let options = {
        skip: Number(skip),
        limit: Number(limit),
      };
      let conditions = {};

      if (searchBy === "author") {
        /* Find authors first */
        const users = await User.find({
          nickName: new RegExp(searchStr, "i"),
        }).exec();
        const usersIds = users.map(user => user._id);
        conditions = { ...conditions, author: { $in: usersIds } };
      } else {
        conditions = { ...conditions, title: new RegExp(searchStr, "i") };
      }
      if (jwtPayload._id && postedByMeBool) {
        conditions = { ...conditions, author: jwtPayload._id };
      }

      if (tags.length > 0) {
        conditions = { ...conditions, tags: { $all: tags } };
      }

      options = { sort: { createdAt }, ...options };

      const total = await Post.countDocuments(conditions);
      const posts = await Post.find(conditions, null, options).populate(
        "author tags"
      );
      res.status(200).json({ posts, total });
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
  update: async (req, res) => {
    const { id } = req.params;
    try {
      const post = await Post.findByIdAndUpdate(id, req.body, {
        new: true,
      }).populate("author tags");
      res.status(201).json({ message: "Post updated", post });
    } catch (error) {
      console.log("ERROR", error);
    }
  },
};
