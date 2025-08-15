const mongoose = require("mongoose");

async function connectToMongoDB(mongodb_uri) {
  try {
    await mongoose
      .connect(mongodb_uri)
      .then(() => {
        console.log("Connected to MongoDB successfully");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message);
      });
  } catch (error) {
    console.error("Connection error:", error.message);
  }
}

module.exports = connectToMongoDB;
