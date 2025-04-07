const mongoose = require("mongoose");

const ProductItemSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  description:{ type: String, required: true },
  calories:{ type: Number, required: true },
  quantity: { type: Number}, 
  unit: { type: String }, 
  image: { type: String }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["active", "inactive", "delete"],
    default: "active",
  },
});

let ProductItem = mongoose.model("ProductItem", ProductItemSchema)

module.exports = {ProductItem}