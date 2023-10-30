const { Router } = require("express");
const Product = require("../db/models/Products");
const route = Router();

/**
 * Create product
 */
route.post("/create", async (req, res) => {
  let { name, ownerId, category, city } = req.body;
  try {
    let productObj = {
      name: name,
      ownerId: ownerId,
      city: city,
    };

    if (category) productObj["category"] = category; //by default, category is others

    const product = await Product.create(productObj);

    console.log("Created product: ", product._id);

    return res.status(200).json(product);
  } catch (error) {
    console.error("Failed to call /product/create");
    console.log("ERROR:>>", error);
    res.status(500).json({ error: error.message, dbCode: error?.code });
  }
});

/**
 * Get user's products
 */

route.get("/id/:id", async (req, res) => {
  let { id } = req.params;
  try {
    console.log(`Calling /get/product/:${id}`);
    let product = await Product.findById(id);
    console.log(">>", product);
    if (!product)
      return res
        .status(404)
        .json({ message: `product not found using Id: ${id}` });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(`Failed to call /get/product/:${id}`);
  }
});

/**
 * Fetch all products
 */
route.get("/all", async (req, res) => {
  try {
    console.log("Calling /get/product/all");
    let products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Failed to call /get/product/all ");
  }
});

module.exports = route;
