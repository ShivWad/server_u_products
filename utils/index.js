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
  console.log("SESSION:", req.session);
  console.log(req.path);

  if (req.path == "/api/health") return next();

  console.log(`Session Checker: ${req.session.authenticated}`.green);
  if (req.session.authenticated) {
    console.log(`Found User Session`.green);
    next();
  } else {
    console.log(`No User Session Found`.red);

    if (
      req.path == "/api/user/login" ||
      req.path == "/api/user/signup" ||
      req.path == "/api/product/all"
    )
      return next();

    res.status(302).json({ redUrl: "http://127.0.0.1:5500/login.html" });
  }
};
module.exports = { cryptPassword, comparePassword, sessionChecker };
