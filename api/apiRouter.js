const express = require("express");
const loginController = require('../controller/loginController');
const regController = require('../controller/regController');

const apiRouter = express.Router();

apiRouter.post("/login",loginController).
    post('/register',regController);

module.exports = apiRouter;
