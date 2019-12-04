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
    const { _id } = req.jwtPayload;
    try {
      const newComment = new Comment({
        ...req.body,
        author: _id,
      });
      const createdComment = await newComment.save();
      const comment = await createdComment.populate("author").execPopulate();
      console.log("comment", comment);
      res.status(201).json({ message: "Comment created", comment });
    } catch (error) {
      console.log(error, "ERROR CREATE comment");
      res.status(500).json({ message: "Cannot create comment", error });
    }
  },
  update: async (req, res) => {
    const { id: commentId } = req.params;
    const { _id } = req.jwtPayload;
    try {
      const result = await Comment.findOneAndUpdate(
        { author: _id, _id: commentId },
        req.body,
        {
          new: true,
        }
      )
        .populate("author")
        .exec();
      return res
        .status(201)
        .json({ message: "Comment updated", comment: result });
    } catch (error) {}
  },

  delete: async (req, res) => {
    const { id: commentId } = req.params;
    const { _id } = req.jwtPayload;

    try {
      await Comment.findOneAndDelete({
        author: _id,
        _id: commentId,
      }).exec();
      return res.status(200).json({ message: "Comment deleted" });
    } catch (error) {}
  },
};
