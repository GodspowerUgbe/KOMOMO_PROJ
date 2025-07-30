const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const Students = require("../models/studentModel.js");

const loginController = async (req, res) => {
  let { email, pass } = req.body;

  if (!pass || !email) {
    return res
      .status(400)
      .json({ status: 1, message: " Email and password are required!" });
  }
  pass = pass.trim();
  email = email.trim();

  const match = await Students.findOne({ email }).exec();
  if (!match || ! await bcrypt.compare(pass,match.pass)) {
    return res
      .status(401)
      .json({ status: 1, message: "Incorrect email or password" });
  }
  const accessToken = jwt.sign(
    {email:match.email},
    process.env.ACCESS_KEY,
    {expiresIn:'120s'}
  );

  const refreshToken = jwt.sign(
    {email:match.email},
    process.env.REFRESH_KEY,
    {expiresIn:'30d'}
  );

  match.refreshToken = refreshToken;
  await match.save();

  res.cookie('jwt', refreshToken, { sameSite:true,httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
  res.cookie('accessTok',accessToken,{httpOnly:true,sameSite:true,maxAge:2*60*1000});
  res.json({
    status: 0,
    message: `Welcome ${match.firstName}`,
    student: {
      'firstName':match.firstName,
      'lastName':match.lastName,
      email
    }
  });
};

module.exports = loginController;
