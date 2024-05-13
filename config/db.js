const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/User", {
  userNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", (err) => {
  console.log(err);
});

db.open("open", () => {
  console.log("Connection Established");
});
