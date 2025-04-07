const { Area } = require("../models/areaModel");
const { isRequestDataValid } = require("../utils/appUtils");
module.exports = {
  async createArea   (req, res) {
    try {
      const { name, description, city, geometry } = req.body;
  
      // Validate geometry structure
      if (!geometry || geometry.type !== "Polygon" || !Array.isArray(geometry.coordinates) || geometry.coordinates.length === 0) {
        return res.status(400).json({ status: "NOK", error: "Invalid geometry: must be a GeoJSON Polygon" });
      }
  
      let ring = geometry.coordinates[0]; // Get the outer ring
  
      // Validate that ring is an array of coordinate pairs
      if (!Array.isArray(ring) || ring.length < 4) {
        return res.status(400).json({ status: "NOK", error: "Polygon ring must have at least 4 points (including closure)" });
      }
  
      // Ensure each coordinate is a [lng, lat] pair
      const isValidCoordinate = coord => Array.isArray(coord) && coord.length === 2 && typeof coord[0] === "number" && typeof coord[1] === "number";
      if (!ring.every(isValidCoordinate)) {
        return res.status(400).json({ status: "NOK", error: "Each coordinate must be an array of two numbers [lng, lat]" });
      }
  
      // Check if polygon is closed
      const firstPoint = ring[0];
      const lastPoint = ring[ring.length - 1];
      if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
        ring.push(firstPoint); // Close the polygon
      }
  
      // Update geometry
      geometry.coordinates = [ring];
  
      // Save to database
      const area = new Area({ name, description, city, geometry });
      await area.save();
  
      return res.status(201).json({ status: "OK", data: area });
    } catch (error) {
      return res.status(500).json({ status: "NOK", error: error.message });
    }
  },
async getArea(req, res) {
  try {
    // Merge request data from body, query, and params
    const { id } = { ...req.body, ...req.query, ...req.params };
    
    // Build a filter: if an ID is provided, filter by _id; otherwise, return all areas
    let filter = {};
    if (id) {
      filter._id = id;
    }
    
    const areas = await Area.find(filter);
    
    return res.status(200).json({
      status: "OK",
      message: "Area fetched successfully",
      details: areas,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "NOK",
      error: error.message,
    });
  }
},
}

