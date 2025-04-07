

const express = require("express");
const bodyParser = require("body-parser");
const db = require("./config/dbConfig");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const app = express();
require("dotenv").config();



app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", userRoutes);
app.use("/api", adminRoutes);


// Database connection
db.dbConnection()
  .then(() => {
    console.log("Database connection established");

    // Start your server only after the database connection is established
    app.listen(8083, () => {
      console.log("Server is running on port 8083");
      console.log("Listening to port http://localhost:8083");
    });
  })
  .catch((error) => {
    console.error("Failed to establish database connection:", error);
    process.exit(1); // Exit process if the connection fails
  });