const { Router } = require("express");
const User = require("../db/models/User");

const route = Router();
/**
 * Create new user
 */
route.post("/user", async (req, res) => {
  try {
    const user = await User.create(req.body);
    console.log("Inserted user: ", user._id);
    res.status(200).json(user);
  } catch (error) {
    console.log(error.code);
    console.log(error.message);
    res.status(500).json({ error: error.message, dbCode: error?.code });
  }
});

/**
 * Fetch single user
 */
route.get("/user/:id", async (req, res) => {
  try {
    let { id } = req.params;
    console.log(`Calling /get/user/:${id}`);
    let user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(`Failed to call /get/user/:${id}`);
  }
});

/**
 * Fetch all users
 */
route.get("/users", async (req, res) => {
  try {
    console.log("Calling /get/users");
    let users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Failed to call /get/users");
  }
});

/**
 * Update User
 */
route.put("/user/:id", async (req, res) => {
  try {
    let { id } = req.params;
    console.log(`Calling /put/user/:${id}`);
    let user = await User.findByIdAndUpdate(id, req.body);
    if (!user)
      return res
        .status(404)
        .json({ message: `User not found using Id: ${id}` });

    let updatedUser = await User.findById(id);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(`Failed to call /put/user/:${id}`);
  }
});

/**
 * Delete User
 */
route.delete("/user/:id", async (req, res) => {
  try {
    let { id } = req.params;
    console.log(`Calling /delete/user/:${id}`);

    let user = await User.findByIdAndDelete(id);
    if (!user)
      return res
        .status(404)
        .json({ message: `User not found using Id: ${id}` });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(`Failed to call /delete/user/:${id}`);
  }
});

module.exports = route;
