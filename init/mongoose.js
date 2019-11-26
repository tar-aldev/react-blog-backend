const mongoose = require("mongoose");

const initMongoose = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(
      res => {
        console.log(`Successfully connected to mongoDB`);
      },
      err => {
        console.log(`Cannot connect to mongoDB. Reason:`, err);
      }
    );
};

module.exports = initMongoose;
