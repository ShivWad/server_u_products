const db = require("./db/db");
const express = require("express");
const routes = require("./routes");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use("/api", routes);
const port = 4000;
db.connectDb(process.env.DB_CS);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/api/health", (req, res) => {
  return res.status(200).json({ message: "API is UP" });
});
