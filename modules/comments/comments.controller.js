const Comment = require("./comments.model");

module.exports = {
  getAll: async (req, res) => {
    const { query: queryParams } = req;
    try {
      const comments = await Comment.find(queryParams)
        .sort({ createdAt: -1 })
        .populate("author");
      console.log("comments", comments, "queryParams", queryParams.post);
      res.status(200).json({ comments });
    } catch (error) {
      res.status(500).json({ message: "Cannot fetch comments", error });
    }
  },
  getOne: (req, res) => {},
  addOne: async (req, res) => {
    try {
      const newComment = new Comment({
        ...req.body,
        author: "5dc3f0c64aef5c18da1a785b",
      });
      const comment = await newComment.save();
      res.status(201).json({ message: "Comment created", comment });
    } catch (error) {
      console.log(error, "ERROR CREATE comment");
      res.status(500).json({ message: "Cannot create comment", error });
    }
  },
  update: (req, res) => {},
};
