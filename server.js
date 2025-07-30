const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

const clientRouter = require("./api/apiRouter.js");
const { serverErrHandler, error404 } = require("./api/error.js");
const { reqLog } = require("./middlewares/log.js");

const connectDB = require("./db/config.js");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(reqLog);

app.use("/", clientRouter);

app.use(serverErrHandler);

app.listen(PORT, (err) => {
  if (err) {
    return console.error(`An error occured : ${err}`);
  }
  connectDB(); //db not yet implemented
  console.log(`Server is running at PORT: ${PORT}`);
});
