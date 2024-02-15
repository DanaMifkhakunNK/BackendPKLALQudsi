const mongoose = require("mongoose");

const paketSchema = new mongoose.Schema({
  title: String,
  date: String,
  price: String,
  wa: String,
  image: String,
});

module.exports = mongoose.model("paket", paketSchema);
