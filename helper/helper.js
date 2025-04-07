const jwtSecret = "randomstringfruitbowl";
const { User } = require("../models/userModel.js");


async function sendOtp(contactNo) {
  const url = `https://2factor.in/API/V1/fc6669b4-6cb6-11ee-addf-0200cd936042/SMS/91${contactNo}/AUTOGEN`;
  console.log("OTP URL:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to send OTP. HTTP status: ${response.status}`);
    }

    const data = await response.json();

    if (data.Status !== "Success") {
      throw new Error(`Failed to send OTP. API response: ${data.Details}`);
    }

    return data;
  } catch (error) {
    console.error("Error in sendOtp function:", error.message);
    throw new Error(`OTP sending failed: ${error.message}`);
  }
}

async function verifyOtp(session_code, otp_code) {
  const url = `http://2factor.in/API/V1/fc6669b4-6cb6-11ee-addf-0200cd936042/SMS/VERIFY/${session_code}/${otp_code}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      // headers: {
      //   Cookie: "__cfduid=d3873a75f3e6843a5117359bd027d9c7a1588843417",
      // },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function generateRefferalCode() {
  try {
    const char = "WYBO";
    const digits = "0123456789";

    let referralCode = char; // Start with the fixed characters

    // Generate the remaining digits randomly
    for (let i = 0; i < 5; i++) {
      referralCode += digits.charAt(Math.floor(Math.random() * digits.length));
    }

    // Check if the generated code is unique
    const existingCode = await User.findOne({ referral_code: referralCode });
    if (existingCode) {
      // If the code already exists, recursively call the function again to generate a new one
      return generateRefferalCode(); // Return the promise directly
    }
    return referralCode.toString(); // Return the generated referral code as a string
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

module.exports = {
  sendOtp: sendOtp,
  verifyOtp: verifyOtp,
  jwtSecret:jwtSecret,
};