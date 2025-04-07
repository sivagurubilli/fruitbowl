const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  image: { type: String },
  status: {
    type: String,
    enum: ["active", "inactive", "delete"],
    default: "active",
  },
});

let Category = mongoose.model("Category", CategorySchema);
module.exports = {Category}