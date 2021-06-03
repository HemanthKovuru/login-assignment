const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const userRouter = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
// cookie parser
app.use(cookieParser());

// cors
if (process.env.NODE_ENV === "production") {
  app.use(
    cors({
      origin: "https://assignment-pritam-nursery.herokuapp.com",
      credentials: true,
    })
  );
} else {
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
}

// body parser
app.use(express.json());

// static files
app.use(express.static(`${__dirname}/public`));

// routes
app.use("/api/v1/users", userRouter);

if ((process.env.NODE_ENV = "production")) {
  app.use(express.static("frontend/build"));

  app.get("/*", (req, res) =>
    res.sendFile(path.join(__dirname, "frontend/build/index.html"))
  );
}

module.exports = app;
