const jwt = require("jsonwebtoken");
const { User, ROLE_USER, STATUS_ACTIVE } = require("../models/userModel.js");
const { isRequestDataValid } = require("../utils/appUtils.js");
const { getCurrentDateAndTime } = require("../helper/dates.js");
const helper = require("../helper/helper.js");
const { Product } = require("../models/productModel.js");
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
console.log(otpResponse)
      res.json({ status: "OK", details: otpResponse.Details });
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


      if (!user || user.formSteps !== 2) {
        return res.status(400).json({
          status: "NOK",
          error: "Please update your  details!",
          details: "Please update your  details!",
        });
      }


      let products = await Product.find({
        status: "active",
      }).populate("category");          // bring in the Category doc
  
      // 2. Filter by the Category.categoryType matching user.bmiCategory
      products = products.filter(p => p.category.categoryType === user.bmiCategory);
  
      return res.status(200).json({
        status: "OK",
        message: "Recommended products fetched successfully",
        details: products,
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
      email,
        weight,
        age,
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
       email,
        weight,
        height,
        age,
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

     

      // Update user profile
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          name,

          age,
          gender,
          weight,
          height,
   
          email,
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



  async  checkBMI(req, res) {
    try {
      const { weight, height, age, gender } = {   ...req.body,
        ...req.query,
        ...req.params,};
  
      // Validate presence
      if ([weight, height, age, gender].some(v => v == null)) {
        return res.status(400).json({
          status: "NOK",
          error: "weight, height, age and gender are all required."
        });
      }
  
      // Parse and validate numeric
      const w = parseFloat(weight);
      const h = parseFloat(height/100);
      const a = parseInt(age, 10);
      const g = parseInt(gender, 10);
      
      if (isNaN(w) || w <= 0 || isNaN(h) || h <= 0) {
        return res.status(400).json({
          status: "NOK",
          error: "weight and height must be positive numbers."
        });
      }
      if (isNaN(a) || a <= 0) {
        return res.status(400).json({
          status: "NOK",
          error: "age must be a positive integer."
        });
      }
      if (![1,2,3].includes(g)) {
        return res.status(400).json({
          status: "NOK",
          error: "gender must be one of 1 (male), 2 (female), or 3 (other)."
        });
      }
  
      
      // Calculate BMI
      const bmi = w / (h * h);
      const roundedBmi = parseFloat(bmi.toFixed(2));

      // Determine category for adults
      let category;
      if (a >= 18) {
        if (bmi < 18.5) category = 1; //Underweight
        else if (bmi < 25) category = 2; //"Normal weight"
        else if (bmi < 30) category = 3; //"Overweight"
        else category = 4; //obesity
      } else {
        // Pediatric note
        category = "Use pediatric growth chart for interpretation";
      }

     
      const userId = req.user._id;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          age: a,
          gender: g, // Using 'g' as parsed gender to match the validation
          weight: w,
          height: height, // Corrected to 'h' to match the parsed height variable
          bmi: roundedBmi,
          bmiCategory: category // Using 'category' as the field name for BMI category
        },
        { new: true } // Ensures the updated document is returned
      );
 
      return res.status(200).json({
        status: "OK",
        details: updatedUser
        
      });
    } catch (err) {
      return res.status(500).json({
        status: "NOK",
        error: err.message
      });
    }
},

}