const mongoose = require("mongoose");
/**
 * Connect to db
 */
const connectDb = async (uri) => {
  await mongoose
    .connect(uri)
    .then((res) => {
      console.log("Connected to DB", res.connection.name);
    })
    .catch((err) => console.log("FAILED: ", err));
};

module.exports = { connectDb };
