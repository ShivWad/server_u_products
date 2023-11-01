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
      required: [false],
      default: "Others",
    },
    city: {
      type: String,
      required: [true, "Need city in which this product is right now"],
    },
    images: {
      type: String,
      required: [false],
    },
    description: {
      type: String,
      required: [false],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
