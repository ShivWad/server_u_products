const { Router } = require("express");
const express = require("express");
const Product = require("../db/models/Products");
const route = Router();
const multer = require("multer");
const uploadFileToFireStore = require("../db/firesbase/firebase");
const { sessionChecker } = require("../utils");
route.use(express.urlencoded({ extended: false }));

const upload = multer({ storage: multer.memoryStorage() });
/**
 * Create product
 */
route.post("/create", sessionChecker, async (req, res) => {
  let { name, ownerId, category, city, images, price, description } = req.body;

  try {
    let productObj = {
      name: name,
      ownerId: ownerId,
      city: city,
      price: price,
      description: description,
      isAvailable: true,
    };

    if (category) productObj["category"] = category; //by default, category is others
    if (images) productObj["images"] = images; //by default, category is others

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
 * Upload prouct images
 */
route.put("/images/:id", [sessionChecker, upload.any()], async (req, res) => {
  let { id } = req.params;
  let uploadedImages = req.files;
  try {
    if (uploadedImages.length < 1)
      return res
        .status(400)
        .json({ message: "ERROR", error: "No images received" });

    Product.findById(id).then(async (product) => {
      let imagesStringArray = product.images;
      if (
        imagesStringArray.length >= 5 ||
        imagesStringArray.length + uploadedImages.length > 5
      )
        return res
          .status(400)
          .json({ message: "ERROR", error: "MAX IMAGE OVERFLOW ACHIEVED" });

      for (let i = 0; i < uploadedImages.length; i++) {
        let downloadUrl = await uploadFileToFireStore(uploadedImages[i]);
        if (downloadUrl) imagesStringArray.push(downloadUrl);
      }

      await Product.findByIdAndUpdate(id, {
        images: imagesStringArray,
      });
      let updatedProduct = await Product.findById(id);
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
    res.status(500).json({ error: error.message, dbCode: error?.code });
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
    res.status(500).json({ error: error.message, dbCode: error?.code });
    console.error("Failed to call /get/product/all ");
  }
});

/**
 * Update user product
 */
route.put("/id/:id", sessionChecker, async (req, res) => {
  let { ownerId } = req.body;
  let { id } = req.params;
  try {
    console.log(`Calling /put/product/:${id}`);
    let product = await Product.findById(id);

    if (ownerId != product.ownerId)
      return res.status(400).json({ message: `Owner doesn't match` });

    if (!product)
      return res
        .status(404)
        .json({ message: `product not found using Id: ${id}` });

    await product.updateOne(req.body);
    let updatedProduct = await Product.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message, dbCode: error?.code });
    console.error(`Failed to call /put/product/:${id}`);
  }
});

/**
 * Filter products
 */
route.get("/filter", async (req, res) => {
  let { sortBy, sortDirection } = req.query;
  console.log(req.query);
  try {
    let queryObj = [];
    Object.keys(req.query).forEach((filter) => {
      if (!filter.toLowerCase().includes("sort")) {
        let tempQuery = {};
        tempQuery[filter] =
          filter === "name"
            ? new RegExp(req.query[filter], "i")
            : req.query[filter];
        queryObj.push(tempQuery);
      }
    });

    let sortOptions = {};
    sortOptions[sortBy ? sortBy : "createdAt"] = sortDirection
      ? sortDirection
      : "desc";

    console.log(queryObj, sortOptions);

    let products = await Product.find({
      $and: [
        { isAvailable: { $eq: true } },

        {
          $and: queryObj,
        },
      ],
    }).sort(sortOptions);

    res.status(200).json({ message: "SUCCESS", products: products });
  } catch (error) {
    res.status(500).json({ error: error.message, dbCode: error?.code });
    console.error(`Failed to call /filter`);
  }
});

module.exports = route;