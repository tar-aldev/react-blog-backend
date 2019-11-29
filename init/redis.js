const redis = require("redis");

module.exports = () => {
  const client = redis.createClient();
  client.on("error", function(err) {
    console.log("Cannot conenct to Redis" + err);
  });
};
