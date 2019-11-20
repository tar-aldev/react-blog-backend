export const pagiantion = [
  {
    $skip: Number(query.skip),
  },
  {
    $limit: Number(query.limit),
  },
  {
    $lookup: {
      from: "users",
      localField: "author",
      foreignField: "_id",
      as: "author",
    },
  },
  {
    $unwind: "$author",
  },
  {
    $lookup: {
      from: "tags",
      localField: "tags",
      foreignField: "_id",
      as: "tags",
    },
  },
];
