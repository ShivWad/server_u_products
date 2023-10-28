const bcrypt = require("bcryptjs");

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
module.exports = { cryptPassword, comparePassword };
