const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    ownerId: {
      type: String,
      required: [true, "Need owner(user) id of this product"],
    },
    category: {
      type: String,
      required: [false, "Need category"],
      default: "Others",
    },
    city: {
      type: String,
      required: [true, "Need city in which this product is right now"],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
