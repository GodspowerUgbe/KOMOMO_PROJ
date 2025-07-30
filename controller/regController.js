const bcrypt = require('bcrypt');
const Students = require("../models/studentModel.js");
const Admins = require("../models/adminModel.js");
const Lecturers = require("../models/lecturerModel.js");

const regController = async (req, res) => {
  let { firstName, lastName, email, pass , role} = req.body, userModel;

  if (!firstName || !lastName || !pass || !email || !role) {
    return res.status(400).json({
      status: 1,
      message: "FirstName,LastName, password,and email are required!",
    });
  }

  switch(role){
    case 'admin':
      userModel = Admins;
      break;
    case 'lecturer':
      userModel = Lecturers;
      break;
    default:
      userModel = Students;
  }

  if (pass.length < 8) {
    return res
      .status(400)
      .json({ status: 1, message: "Enter a password of 8 or more characters" });
  }

  firstName = firstName.trim();
  lastName = lastName.trim();
  email = email.trim();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ status: 1, message: "Invalid email" });
  }
  console.log('passed')

  const duplicate = await userModel.findOne({ email }).exec();
  if (duplicate) {
    return res
    .status(400)
    .json({ status: 1, message: "Email has already been used " });
  }
  
  pass = await bcrypt.hash(pass, 15);

  const student = await userModel.create({ firstName, lastName, email, pass });
  console.log('created');

  res.status(201).json({ status: 0, message: "New user created",user:{firstName,lastName,email,role} });
};

module.exports = regController;

