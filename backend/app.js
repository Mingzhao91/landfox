const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
//const jwtBlock = require("./management/jwt");

const itemRouter = require("./routers/itemRoutes");
const categoryRouter = require("./routers/categoryRoutes");
const userRouter = require("./routers/userRoutes");
const cartRouter = require("./routers/cartRoutes");

require("dotenv").config();

const url = process.env.URL;

// Middlewares
app.use(morgan("tiny"));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));
// app.use(jwtBlock());
// cors
app.use(cors());
app.options("*", cors());

app.use(`${url}/item`, itemRouter);
app.use(`${url}/category`, categoryRouter);
app.use(`${url}/user`, userRouter);
app.use(`${url}/cart`, cartRouter);

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection to database successful");
  })
  .catch((err) => {
    console.log("Connection to database failed Error: " + err);
  });

app.listen(3000, () => {
  console.log("server running on port 3000");
});
