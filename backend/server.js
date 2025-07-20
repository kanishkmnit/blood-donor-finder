require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Donor = require("./models/donors");
const cors = require("cors");

const app = express();

// ✅ Middleware setup
app.use(cors());
app.use(express.json());

// ✅ Serve frontend static files from '../frontend'
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ Optional default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Donor Registration Endpoint
app.post("/register", async (req, res) => {
  try {
    const { name, contact, city, bloodGroup, date } = req.body;

    if (!name || !contact || !city || !bloodGroup || !date) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newDonor = new Donor({
      name,
      contact,
      city,
      bloodGroup,
      date: new Date(date),
    });

    await newDonor.save();
    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Failed to register. Please try again." });
  }
});

// ✅ Find Donors Endpoint
app.get("/find", async (req, res) => {
  try {
    const { city, bloodGroup } = req.query;

    if (!city || !bloodGroup) {
      return res
        .status(400)
        .json({ message: "City and Blood Group required." });
    }

    const donors = await Donor.find({ city, bloodGroup });
    res.status(200).json(donors);
  } catch (error) {
    console.error("❌ Find Error:", error);
    res.status(500).json({ message: "Failed to fetch donors." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});