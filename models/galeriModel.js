const { Schema, model } = require("mongoose");

const galeriSchema = new Schema(
  {
    galeri: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("galeri", galeriSchema);
