const app = require("express")();

app.use("/auth", require("./auth"));
app.use("/users", require("./users"));
app.use("/posts", require("./posts"));

module.exports = app;
