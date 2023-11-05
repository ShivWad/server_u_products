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
    res.status(302).json({ redUrl: "http://127.0.0.1:5500/login.html" });
  }
};
module.exports = { cryptPassword, comparePassword, sessionChecker };
