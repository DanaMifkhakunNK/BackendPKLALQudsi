const { Schema, model } = require("mongoose");

const kontakSchema = new Schema(
  {
    logo: {
      type: String,
      required: true,
    },
    alamat: {
      type: String,
      required: true,
    },
    wa: {
      type: String,
      required: true,
    },
    fb: {
      type: String,
      required: true,
    },
    ig: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("kontak", kontakSchema);
