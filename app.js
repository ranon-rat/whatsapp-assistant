require('dotenv').config()
// dependencies
const express = require("express"),
  body_parser = require("body-parser"),
   rout=require("./src/routes"),
  app = express().use(body_parser.json());
app.listen(process.env.PORT || 3000, () => console.log("webhook is listening"));
// this will work for adding new stuff

app.use("/",rout())