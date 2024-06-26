const express = require("express");
const express_session = require("express-session");
const cors = require("cors");
const MongoStore = require("connect-mongo");
const routes = require("./routes");
const db = require("./db/db");
const dotenv = require("dotenv");
const { CATEGORIES_JSON, GetCityState } = require("./utils");
const app = express();
const port = 4000;
dotenv.config();

//connect db
db.connectDb(process.env.DB_CS);

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
//middleware to just log incoming requests
app.use((req, res, next) => {
  console.log(`Calling ${req.url}`);
  next();
});

app.use(
  express_session({
    name: "EXSESID",
    secret: process.env.SES_SECRET,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_CS,
      dbName: "session-store",
    }),
    cookie: {
      maxAge: 3600000,
      secure: false,
    },
  })
);

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/api/health", (req, res) => {
  return res.status(200).json({ message: "API is UP" });
});

app.get("/api/categories", (req, res) => {
  let catJson = CATEGORIES_JSON;
  return res.json(catJson);
});

app.get("/api/cities", (req, res) => {
  let citiesJson = GetCityState();
  return res.json(citiesJson);
});
