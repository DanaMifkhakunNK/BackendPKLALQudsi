const mongoose = require("mongoose");

const paketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    date: {
      type: String,
      required: [true, "date is required"],
    },
    price: {
      type: String,
      required: [true, "price is required"],
    },
    wa: {
      type: String,
      required: [true, "pesan is required"],
    },
    image: {
      url: String,
      public_id: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("paket", paketSchema);
