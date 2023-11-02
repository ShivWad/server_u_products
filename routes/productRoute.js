const { Router } = require("express");
const express = require("express");
const Product = require("../db/models/Products");
const route = Router();
const multer = require("multer");
const uploadFileToFireStore = require("../db/firesbase/firebase");
route.use(express.urlencoded({ extended: false }));

const upload = multer({ storage: multer.memoryStorage() });
/**
 * Create product
 */
route.post("/create", async (req, res) => {
  let { name, ownerId, category, city, images, price } = req.body;

  try {
    let productObj = {
      name: name,
      ownerId: ownerId,
      city: city,
      price: price,
    };

    if (category) productObj["category"] = category; //by default, category is others
    if (images) productObj["images"] = images; //by default, category is others

    const product = await Product.create(productObj);

    console.log("Created product: ", product._id);

    return res.status(200).json(product.ownerId);
  } catch (error) {
    console.error("Failed to call /product/create");
    console.log("ERROR:>>", error);
    res.status(500).json({ error: error.message, dbCode: error?.code });
  }
});

/**
 * Upload prouct images
 */
route.put("/images/:id", upload.any(), async (req, res) => {
  let { id } = req.params;
  let uploadedImages = req.files;
  try {
    if (uploadedImages.length < 1) throw Error("No images received");
    Product.findById(id).then(async (product) => {
      let imagesString = product?.["images"];
      let splitImageString;

      splitImageString = imagesString?.split(",");
      splitImageString = splitImageString ? splitImageString : [];

      for (let i = 0; i < uploadedImages.length; i++) {
        let downloadUrl = await uploadFileToFireStore(uploadedImages[i]);
        if (downloadUrl) splitImageString.push(downloadUrl);
      }

      let updatedImageString = splitImageString.join(",");

      let updatedProduct = await Product.findByIdAndUpdate(id, {
        images: updatedImageString,
      });
      res
        .status(200)
        .json({ message: "SUCCESS", updatedProduct: updatedProduct });
    });
  } catch (error) {
    console.error("Failed to call /product/images/:id");
    console.log("ERROR:>>", error);
    res.status(500).json({ error: error.message, dbCode: error?.code });
  }
});

/**
 * Get single product
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

/**
 * Update user product
 */
route.put("/id/:id", async (req, res) => {
  let { id } = req.params;
  try {
    console.log(`Calling /put/product/:${id}`);
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

module.exports = route;
