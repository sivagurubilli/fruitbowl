const mongoose = require("mongoose");

const AreaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    city: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive", "delete"],
      default: "active",
    },
    geometry: {
      type: {
        type: String,
        enum: ["Polygon"],
        required: true,
      },
      coordinates: {
        type: [[[Number]]], // Array of arrays for Polygon coordinates
        required: true,
      },
    },
  },
  { timestamps: true }
);

// Creating a geospatial index for querying
AreaSchema.index({ geometry: "2dsphere" });

const Area = mongoose.model("Area", AreaSchema);
module.exports = { Area };
