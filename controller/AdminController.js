
const { User, ROLE_ADMIN, STATUS_ACTIVE } = require("../models/userModel");
const { isRequestDataValid } = require("../utils/appUtils");
const axios = require('axios');
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helper = require("../helper/helper");
const saltRounds = 10;



module.exports = {
  async login(req, res) {
    try {
      let { email, password } = Object.assign(
        req.body,
        req.query,
        req.params
      );
      const requiredFields = {  email, password };

      let validationResult = isRequestDataValid(requiredFields, "1234");
      
      if (validationResult !== true) {
        return res.status(400).json({ status: "NOK", error: validationResult });
      }
      const getUser = await User.findOne({ email: email,userRole:"admin" });
      console.log(getUser)
      if (!getUser) {
        return res
          .status(403)
          .json({ status: "NOK", error: "Invalid Credientials" });
      } else {
        const comparePassword = await bcrypt.compare(
          password,
          getUser.password
        );
        if (comparePassword) {
          const token = jwt.sign({ email, ROLE_ADMIN }, helper.jwtSecret);
          getUser.authCode = token;
          getUser.save();

          res.json({
            status: "OK",
            message: "Logged In Succesfully",
            data: getUser,
          });
        } else {
          return res
            .status(403)
            .json({ status: "NOK", error: "Invalid Credientials" });
        }
      }
    } catch (error) {
      res.status(500).json({ status: "NOK", error: error.message,details:error.message });
    }
  },
  async createAdmin(req, res) {
    try {
      // Hash the password
      // console.log(req.body);
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      console.log(hashedPassword);

      var email = req.body.email;
      const token = jwt.sign({ email, ROLE_ADMIN }, helper.jwtSecret);
      // Create a new user instance
      const newUser = new User({
        ...req.body,
        password: hashedPassword,
        authCode: token,
        userRole: ROLE_ADMIN,
      });

      // Save the new user to the database
      await newUser.save();

      // Fetch the newly created user
      const user = await User.findById(newUser._id);

      res.json({
        status: "OK",
        message: "Admin Created Successfully",
        details: user, // Return information about the newly created user
      });
    } catch (error) {
      res.status(500).json({ status: "NOK",error: error.message,details:error.message });
    }
  },
}