const { Schema, model } = require("mongoose");

const testiSchema = new Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    testimonial: {
      type: String,
      required: true,
    },
    testigambar: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("testi", testiSchema);
