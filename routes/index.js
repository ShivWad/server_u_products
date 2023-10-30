const userRoute = require("./userRoute");
const productRoute = require("./productRoute");
const express = require("express");
const app = express();
module.exports = (function () {
  "use strict";
  app.use("/user/", userRoute);
  app.use("/product/", productRoute);

  return app;
})();
