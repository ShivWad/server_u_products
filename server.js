const express = require("express");
const express_session = require("express-session");
const cors = require("cors");

const routes = require("./routes");
const db = require("./db/db");
const { sessionChecker } = require("./utils");
const dotenv = require("dotenv");
const app = express();
const port = 4000;

dotenv.config();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use(
  express_session({
    name: "EXSESID",
    secret: "XDb0XrqDL99Ovkj",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 3600000,
      secure: false,
    },
  })
);

app.use(sessionChecker);

app.use("/api", routes);

db.connectDb(process.env.DB_CS);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/api/health", (req, res) => {
  return res.status(200).json({ message: "API is UP" });
});
