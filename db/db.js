const mongoose = require("mongoose");
/**
 * Connect to mongo db using mongoose ODM
 * @param uri db connection string
 */
const connectDb = async (uri) => {
  let res = await mongoose.connect(uri, { dbName: "u_product" });
  console.log("Connected to DB", res.connection.name);
  return res;
};

module.exports = { connectDb };
