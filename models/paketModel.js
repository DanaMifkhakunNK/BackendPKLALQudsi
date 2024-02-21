const { Schema, model } = require("mongoose");

const paketSchema = new Schema(
  {
    judul: {
      type: String,
      required: true,
    },
    tanggal: {
      type: String,
      required: true,
    },
    harga: {
      type: String,
      required: true,
    },
    pesan: {
      type: String,
      required: true,
    },
    gambar: {
      type: String,
      required: true,
    },
    pembuat: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("paket", paketSchema);
