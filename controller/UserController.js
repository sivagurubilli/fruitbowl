const jwt = require("jsonwebtoken");
const { User, ROLE_USER, STATUS_ACTIVE } = require("../models/userModel.js");
const { isRequestDataValid } = require("../utils/appUtils.js");
const { getCurrentDateAndTime } = require("../helper/dates.js");
const helper = require("../helper/helper.js");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  async sendOtp(req, res) {
    try {
      const {contactNo} = {
        ...req.body,
        ...req.query,
        ...req.params,
      };

      // Now you can use contactNo to send the OTP
      console.log("Contact Number:", contactNo);

      const otpResponse = await helper.sendOtp(contactNo);

      res.json({ status: "OK", message: otpResponse });
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      res
        .status(500)
        .json({
          status: "NOK",
          message: "Failed to send OTP. Please try again later.",
          error: error.message,
        });
    }
  },

  async verifyOtp(req, res) {
    try {
      const { contactNo, otp, session_code,deviceToken, deviceType, ipAddress } = {
        ...req.body,
        ...req.query,
        ...req.params,
      };
      const requiredFields = { session_code,contactNo, otp };

      let currentDatetime = getCurrentDateAndTime();

      const verifyOtp = await helper.verifyOtp(session_code, otp);
      // console.log(ROLE_USER);
      if (verifyOtp.Status == "Success") {
        // Verify OTP success
        let user = await User.findOne({ contactNo: contactNo });
        console.log(verifyOtp);
        if (!user) {
          // User not found, create new user and generate token
          const token = jwt.sign({ contactNo, ROLE_USER }, helper.jwtSecret);
      
          // Create new user document
          const newUserFields = {
            contactNo,
            deviceToken,
            deviceType,
            userRole: ROLE_USER,
            status: STATUS_ACTIVE,
            authCode: token,
            formSteps: 1,
            createdAt: currentDatetime,
            updatedAt: currentDatetime,
           
          };

          const newUser = new User(newUserFields);
          user = await newUser.save(); // Save new user
        } else {
          const token = jwt.sign(
            { contactNo, userRole: ROLE_USER },
            helper.jwtSecret
          );
          user.authCode = token;

          await user.save(); // Update existing user
        }


        res.json({
          status: "OK",
          message: "OTP Verified!!",
          details: user,
        });
      } else {
        console.log(contactNo);

        res.json({ status: "NOK", error: "Invalid OTP" });
      }
    } catch (error) {
      res.status(500).json({ status: "NOK", error: error.message });
    }
  },

  async getUserRecommendedProducts(req, res) {
    try {
      let user = req.user;

      let bmi = user.BMI;

      if (!user || user.formSteps !== 2) {
        return res.status(400).json({
          status: "NOK",
          error: "Please update your  details!",
          details: "Please update your  details!",
        });
      }
      if (!bmi) {
        return res.status(400).json({
          status: "NOK",
          error: "BMI is required!",
          details: "BMI is required!",
        });
      }
      const bmiValue = Number(bmi);

      // Query products where the BMI is within the minBMI and maxBMI range
      const recommendedProducts = await Product.find({
        status: "active",
        minBMI: { $lte: bmiValue },
        maxBMI: { $gte: bmiValue },
      });

      return res.status(200).json({
        status: "OK",
        message: "Recommended products fetched successfully",
        details: recommendedProducts,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "NOK",
        error: error.message,
      });
    }
  },

  async updateProfile(req, res) {
    try {
      const userId = req.user._id; // Assuming user ID is extracted from auth middleware
      const {
        name,
      
        weight,
        dob,
        gender,
        height,
        profile_image,
        latitude,
        longitude,
      } = {
        ...req.body,
        ...req.query,
        ...req.params,
      };
      const requiredFields = {
        name,
       
        weight,
        height,
        dob,
        gender,
        profile_image,
        // latitude,
        // longitude,
      };
      let requestDataValid = isRequestDataValid(requiredFields, "1234");
      if (requestDataValid !== true) {
        return res.status(400).json({ status: "NOK", error: requestDataValid });
      }

      if (![1, 2, 3].includes(gender)) {
        return res
          .status(400)
          .json({ status: "NOK", error: "Invalid gender value." });
      }

      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      // Calculate BMI
      // Since we don't have height, we assume a default height of 1.70 meters.
      const BMI = weight / (height * height);

      // Update user profile
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          name,

          dob,
          gender,
          weight,
          height,
          age,
          BMI,
          profile_image,
          latitude,
          formSteps: 2,
          longitude,
          updatedAt: getCurrentDateAndTime(),
        },
        { new: true }
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({ status: "NOK", message: "User not found." });
      }

      return res.status(200).json({
        status: "OK",
        message: "Profile updated successfully",
        details: updatedUser,
      });
    } catch (error) {
      return res.status(500).json({
        status: "NOK",
        error: error.message,
        details: error.message,
      });
    }
  },
};
