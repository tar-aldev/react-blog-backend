const app = require("express")();

app.use("/auth", require("./auth"));
app.use("/users", require("./users"));
app.use("/posts", require("./posts"));
app.use("/tags", require("./tags"));
app.use("/comments", require("./comments"));

module.exports = app;
