const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to authenticate the token and attach user data to req.user
const authenticateToken = async (req, res, next) => {
  const token = req.headers.authcode;

  
  if (!token) {
    return res
      .status(401)
      .json({ status: "NOK", error: "Access denied. No token provided.",details:"Access denied. No token provided."  });
  }
  try {
    const user = await User.findOne({
      authCode: token,
    });
    if (!user) {
      return res.status(404).json({
        status: "NOK",
        error: "Invalid Auth Code or User not found",
        details: "Invalid Auth Code or User not found"
      });
    }else if(user.status !== "active"){
      return res.status(404).json({
        status: "NOK",
        error: "The user account is not active or the account has been deactivated, please contact support.",
        details: "The user account is not active or the account has been deactivated, please contact support.",

      });
    }

    req._id = user._id;
    req.user = user;

    next();
  } catch (err) {
    return res.status(400).json({ status: "NOK", error: "Invalid token.",details:  "Invalid token."});
  }
};

const getUserDetails = async (token) => {
  try {
    const user = await User.findOne({
      authCode: token,
    });
    if (!user) {
      return res.status(404).json({
        status: "NOK",
        error: "Invalid Auth Code or User not found",
        details: "Invalid Auth Code or User not found"
      });
    }
    return user._id;
  } catch (err) {
    return null;
  }
};

// Middleware to authorize the user role
const authorizeUser = (req, res, next) => {
  if (req.user.userRole !== "user") {
    return res
      .status(403)
      .json({ status: "NOK", error: "Access denied. Not a user." });
  }
  next();
};

// Middleware to authorize the admin role
const authorizeAdmin = (req, res, next) => {
  if (req.user.userRole !== "admin") {
    return res
      .status(403)
      .json({ status: "NOK", error: "Access denied. Not an admin." });
  }
  next();
};

module.exports = {
  authenticateToken,
  authorizeUser,
  authorizeAdmin,
  getUserDetails,
};