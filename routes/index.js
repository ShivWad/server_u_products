const userRoute = require("./userRoute");

const express = require("express");
const app = express();
module.exports = (function () {
  "use strict";
  app.use(userRoute);
  return app;
})();
