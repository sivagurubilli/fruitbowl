const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  discountPrice :{type: Number, required: true},
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  image: { type: String },
  productItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductItem" }], 
  minBMI: { type: Number }, // Minimum BMI for recommendation
  maxBMI: { type: Number },// Maximum BMI for recommendation
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["active", "inactive", "delete"],
    default: "active",
  },
});

let Product= mongoose.model("Product", ProductSchema);
module.exports = {Product}