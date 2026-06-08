require("dotenv").config();
const mongoose = require("mongoose");

console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    console.log("Database:", mongoose.connection.name);
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB Failed");
    console.error(err);
    process.exit(1);
  });