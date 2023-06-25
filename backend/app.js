const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");

require("dotenv").config();

const url = process.env.URL;

// Middlewares
app.use(morgan("tiny"));
app.use(express.json());

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

app.get(url, (req, res) => {
  const item = req.body;
  res.send(item);
});

app.listen(3000, () => {
  console.log("server running on port 3000");
});
