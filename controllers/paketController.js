const Paket = require("../models/paketModel");
const User = require("../models/userModel");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel");

// post paket  api/paket
const createPaket = async (req, res, next) => {
  try {
    let { judul, tanggal, harga, pesan } = req.body;
    const { gambar } = req.files;
    if (gambar.size > 2000000) {
      return next(new HttpError("gambar terlalu besar"));
    }
    let fileName = gambar.name;
    let splittedFilename = fileName.split(".");
    let newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1];
    gambar.mv(path.join(__dirname, "..", "/uploads", newFilename), async (err) => {
      if (err) {
        return next(new HttpError(err));
      } else {
        const newPaket = await Paket.create({ judul, tanggal, harga, pesan, gambar: newFilename, pembuat: req.user.id });
        if (!newPaket) {
          return next(new HttpError("gagal membuat paket", 422));
        }

        const currentUser = await User.findById(req.user.id);
        const userPaketCount = currentUser.posts + 1;
        await User.findByIdAndUpdate(req.user.id, { posts: userPaketCount });

        res.status(201).json(newPaket);
      }
    });
  } catch (error) {
    return next(new HttpError(error));
  }
};
// get paket  api/paket
const getPaket = async (req, res, next) => {
  try {
    const pakets = await Paket.find().sort({ updatedAt: -1 });
    res.status(200).json(pakets);
  } catch (error) {
    return next(new HttpError(error));
  }
};
// get paket  api/paket:id
const getSingle = async (req, res, next) => {
  res.json("Single paket");
};
// patch paket api/paket/:id
const editPaket = async (req, res, next) => {
  res.json("Edit Post");
};
// detele paket api/paket/:id
const deletePaket = async (req, res, next) => {
  res.json("delete Post");
};

module.exports = { createPaket, getPaket, getSingle, editPaket, deletePaket };
