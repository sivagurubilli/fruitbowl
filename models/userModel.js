const mongoose = require("mongoose");
const ROLE_USER = "user";
const ROLE_ADMIN = "admin";
const STATUS_ACTIVE = "active";
const STATUS_INACTIVE = "inactive";
const STATUS_DELETE = "delete";

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    password: {
        type: String,
      },
      
    dob: {
      type: Date,
    },
      BMI :{
        type: String,
    },
    age:{
        type:Number,
    },
    weight:{
      type:Number,
  },
  height:{
 type:Number,
  },
    email: {
        type: String,
      },
    contactNo:{
        type: Number, 
    },
    gender: {
      type: String,
      enum:[1,2,3],  // 1 male,2 female ,3  other
    },
    deviceToken: {
        type: String,
        required: false,
      },
      deviceType: {
        type: String,
        required: false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      authCode: {
        type: String,
        required: false,
      },
      userRole: {
        type: String,
        required: false,
      },
      status: {
        type: String,
      },
      formSteps:{
        type: Number,  
      },
      profile_image: {
        type: String,
        default:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?ga=GA1.1.384368088.1735624997&semt=ais_hybrid"
      },
      status: {
        type: String,
        enum: ["active", "inactive", "delete"],
        default: "active",
      },
      latitude: {
        type: Number, // Changed to Number for geographical accuracy
        required: false,
      },
      longitude: {
        type: Number, // Changed to Number for geographical accuracy
        required: false,
      },
    },{      versionKey: false,
    toObject: { virtuals: true }, toJSON: { virtuals: true }})

// Create the model from the schema
const User = mongoose.model("User", userSchema);

module.exports = { User,
    ROLE_USER,
    ROLE_ADMIN,
    STATUS_DELETE,
    STATUS_INACTIVE,
    STATUS_ACTIVE};
