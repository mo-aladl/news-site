const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const reporterPath = require("../src/routers/reporters");
const articlePath = require("../src/routers/artical");
require("./data_base/mongoose");
app.use(reporterPath);
app.use(articlePath);

app.listen(port, () => {
  console.log("listening to the port" + port);
});
