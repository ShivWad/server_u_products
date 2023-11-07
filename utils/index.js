const bcrypt = require("bcryptjs");
const session = require("express-session");

/**
 *
 * @param {*} password
 * @returns hashedPwd
 */
const cryptPassword = async (password) => {
  let salt = await bcrypt.genSalt(10);
  let hashedPwd = await bcrypt.hash(password, salt);
  return hashedPwd;
};

/**
 *
 * @param {*} password
 * @param {*} hashedPwd
 * @returns bool
 */
const comparePassword = async (password, hashedPwd) => {
  let bool = await bcrypt.compareSync(password, hashedPwd);
  return bool;
};

/**
 * Checks user session
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const sessionChecker = (req, res, next) => {
  console.log(`Session Checker: ${req.session.authenticated}`);
  if (req.session.authenticated) {
    console.log(`Found User Session`);
    next();
  } else {
    console.log(`No User Session Found`);
    res.status(302).json({ redUrl: "http://localhost:3000/login" });
  }
};

const CATEGORIES_JSON = {
  categories: [
    {
      name: "Electronics",
      subcategories: [
        "Phones",
        "Laptops",
        "Cameras",
        "Audio Equipment",
        "Gaming Consoles",
      ],
    },
    {
      name: "Clothing and Accessories",
      subcategories: ["Clothing", "Shoes", "Handbags", "Jewelry", "Watches"],
    },
    {
      name: "Furniture and Home Decor",
      subcategories: [
        "Sofas",
        "Tables",
        "Chairs",
        "Bedding",
        "Home Decor Items",
      ],
    },
    {
      name: "Vehicles",
      subcategories: ["Cars", "Motorcycles", "Bicycles", "RVs", "Boats"],
    },
    {
      name: "Appliances",
      subcategories: [
        "Refrigerators",
        "Washing Machines",
        "Kitchen Appliances",
        "Air Conditioners",
        "Vacuum Cleaners",
      ],
    },
    {
      name: "Books, Movies, and Music",
      subcategories: [
        "Books",
        "DVDs and Blu-rays",
        "CDs and Vinyl Records",
        "Musical Instruments",
      ],
    },
    {
      name: "Sports and Fitness",
      subcategories: [
        "Sports Equipment",
        "Gym Equipment",
        "Bicycles",
        "Outdoor Gear",
        "Athletic Apparel",
      ],
    },
    {
      name: "Toys and Games",
      subcategories: [
        "Toys for Children",
        "Board Games",
        "Video Games",
        "Collectibles",
      ],
    },
    {
      name: "Collectibles and Antiques",
      subcategories: [
        "Coins",
        "Stamps",
        "Vintage Items",
        "Art and Paintings",
        "Rare Items",
      ],
    },
    {
      name: "Health and Beauty",
      subcategories: [
        "Skincare Products",
        "Perfumes",
        "Hair Care Products",
        "Makeup",
        "Health Equipment",
      ],
    },
    {
      name: "Tools and DIY",
      subcategories: [
        "Hand Tools",
        "Power Tools",
        "Garden Equipment",
        "Construction Materials",
      ],
    },
    {
      name: "Pet Supplies",
      subcategories: [
        "Pet Food",
        "Pet Accessories",
        "Cages and Crates",
        "Toys",
      ],
    },
    {
      name: "Baby and Kids",
      subcategories: [
        "Baby Clothes",
        "Strollers",
        "Toys",
        "Child Safety Products",
      ],
    },
    {
      name: "Jewelry and Watches",
      subcategories: ["Rings", "Bracelets", "Necklaces", "Luxury Watches"],
    },
    {
      name: "Miscellaneous",
      subcategories: ["Others"],
    },
  ],
};

module.exports = {
  cryptPassword,
  comparePassword,
  sessionChecker,
  CATEGORIES_JSON,
};
