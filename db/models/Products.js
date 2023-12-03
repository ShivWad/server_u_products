const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Mising ownderId"],
    },
    ownerName: {
      type: String,
      required: [true, "Please enter product ownerName"],
    },
    category: {
      type: String,
      required: [true],
      default: "Missing category",
    },
    subCategory: {
      type: String,
      required: [false],
      default: "Others",
    },
    city: {
      type: String,
      required: [true, "Need city in which this product is right now"],
    },
    images: {
      type: [String],
      required: [false],
    },
    description: {
      type: String,
      required: [false],
    },
    price: {
      type: Number,
      required: [true, "Price Missing"],
    },
    isAvailable: {
      type: Boolean,
      required: [true, "availablity missing"],
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
