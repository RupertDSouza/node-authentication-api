const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/User", {})

  .then(() => {
    console.log("MongoDB Connection successful");
  })
  .catch((error) => {
    console.error("Connection Error", error);
  });

module.exports = mongoose;
