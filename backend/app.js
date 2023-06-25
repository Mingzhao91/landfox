const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const itemRouter = require("./routers/itemRoutes");

require("dotenv").config();

const url = process.env.URL;

// Middlewares
app.use(morgan("tiny"));
app.use(express.json());

app.use(`${url}/items`, itemRouter);

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
