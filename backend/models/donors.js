const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  name: String,
  contact: String,
  city: String,
  bloodGroup: String,
  date: Date
});

module.exports = mongoose.model("Donor", donorSchema);
