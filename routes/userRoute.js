const { Router } = require("express");
const User = require("../db/models/User");
const { cryptPassword, comparePassword, sessionChecker } = require("../utils");
const MongoStore = require("connect-mongo");
const route = Router();
/**
 * Create new user
 */
route.post("/signup", async (req, res) => {
  try {
    console.log("Calling /user/signup");
    if (req.session.authenticated)
      return res.status(302).json({ redUrl: "/home" });

    let { name, email, password } = req.body;
    email = email.trim();

    if (name.trim().length < 1) {
      let resObj = {
        status: "FAILED",
        message: "Missing information",
      };
      console.log(resObj);
      return res.status(400).json(resObj);
    }

    let nameRegEx = /^[a-zA-z ]*$/;

    let emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (name === "" || email === "" || password === "") {
      let resObj = {
        status: "FAILED",
        message: "Missing information",
      };
      console.log(resObj);
      return res.status(400).json(resObj);
    } else if (!nameRegEx.test(name)) {
      let resObj = {
        status: "FAILED",
        message: "Invalid name received",
      };
      console.log(resObj);
      return res.status(400).json(resObj);
    } else if (!emailRegEx.test(email)) {
      let resObj = {
        status: "FAILED",
        message: "Invalid email received",
      };
      console.log(resObj);
      return res.status(400).json(resObj);
    }
    let hashedPwd = await cryptPassword(password);

    let userObj = {
      name: name,
      email: email,
      password: hashedPwd,
    };

    const user = await User.create(userObj);
    console.log("Inserted user: ", user._id);
    res
      .status(200)
      .json({ message: "Signed Up succefully!", status: "SUCCESS" });
  } catch (error) {
    console.error("Failed to call /user/signup");
    console.log("ERROR:>>", error);
    let message = error?.message;
    if (error?.code === 11000) {
      message = "Email already in use!";
    }

    res
      .status(500)
      .json({ message: message, status: "FAILED", dbCode: error?.code });
  }
});

/**
 * Sign in user
 */
route.post("/login", async (req, res) => {
  console.log("Calling /user/login");
  try {
    let { email, password } = req.body;
    email = email.trim();
    if (email === "" || password === "") {
      let resObj = {
        status: "FAILED",
        message: "Missing information",
        receivedPayload: { email, password },
      };
      console.log(resObj);
      return res.status(400).json(resObj);
    }
    User.find({ email })
      .then(async (data) => {
        if (!data.length) {
          //throw 401 when user not found
          let resObj = {
            status: "FAILED",
            message: "Invalid credentials",
          };
          return res.status(401).json(resObj);
        }
        let hashedPwd = data[0].password;
        let bool = await comparePassword(password, hashedPwd);
        if (!bool) {
          //throw 401 when passwords don't match

          let resObj = {
            status: "FAILED",
            message: "Invalid credentials",
          };

          return res.status(401).json(resObj);
        } else {
          req.session.authenticated = true;
          return res.status(200).json({
            status: "SUCCESS",
            user: {
              name: data[0].name,
              emaiL: email,
              userId: data[0].id,
            },
            message: "Logged in succesfully",
          });
        }
      })
      .catch((error) => {
        console.error("Failed to call /user/login");
        console.log("ERROR:>>", error);
        res.status(500).json({ error: error.message, dbCode: error?.code });
      });
  } catch (error) {
    console.error("Failed to call /user/login");
    console.log("ERROR:>>", error);
    let resObj = {
      message: error.message,
      dbCode: error?.code,
      status: "FAILED",
    };
    res.status(500).json(resObj);
  }
});

route.get("/checkauth", sessionChecker, (req, res) => {
  try {
    return res
      .status(200)
      .json({ message: "User session active", isSessionActive: true });
  } catch (error) {
    console.error("Failed to call /user/login");
    console.log("ERROR:>>", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * destroy session
 */
route.get("/logout", sessionChecker, async (req, res) => {
  try {
    console.log("calling /user/logout");
    req.session.destroy();
    res.send({ message: "destroyed" });
  } catch (error) {
    console.error("Failed to call /user/logout");
    console.log("ERROR:>>", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Fetch single user
 */
route.get("/id/:id", async (req, res) => {
  let { id } = req.params;
  try {
    console.log(`Calling /get/user/:${id}`);
    let user = await User.findById(id);
    console.log(">>", user);
    if (!user)
      return res
        .status(404)
        .json({ message: `User not found using Id: ${id}` });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(`Failed to call /get/user/:${id}`);
  }
});

/**
 * Fetch all users
 */
route.get("/all", sessionChecker, async (req, res) => {
  try {
    console.log("Calling /get/user/all");
    let users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Failed to call /get/user/all ");
  }
});

/**
 * Update User
 */
route.put("/id/:id", sessionChecker, async (req, res) => {
  let { id } = req.params;
  try {
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
route.delete("/id/:id", sessionChecker, async (req, res) => {
  let { id } = req.params;
  try {
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
