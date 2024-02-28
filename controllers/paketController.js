const Paket = require("../models/paketModel");

const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel");

// post paket  api/paket
const createPaket = async (req, res, next) => {
  try {
    let { judul, tanggal, harga } = req.body;
    const { gambar } = req.files;
    if (gambar.size > 2000000) {
      return next(new HttpError("ukuran gambar terlalu besar"));
    }
    let fileName = gambar.name;
    let splittedFilename = fileName.split(".");
    let newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1];
    gambar.mv(path.join(__dirname, "..", "/uploads", newFilename), async (err) => {
      if (err) {
        return next(new HttpError(err));
      } else {
        const newPaket = await Paket.create({ judul, tanggal, harga, gambar: newFilename });
        if (!newPaket) {
          return next(new HttpError("gagal menambahkan paket", 422));
        }
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
  try {
    const paketId = req.params.id;
    const paket = await Paket.findById(paketId);
    if (!paket) {
      return next(new HttpError("paket not found", 404));
    }
    res.status(200).json(paket);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// patch paket api/paket/:id
const editPaket = async (req, res, next) => {
  try {
    let fileName;
    let newFilename;
    let updatePaket;
    const paketId = req.params.id;
    let { judul, tanggal, harga } = req.body;

    if (req.user.id) {
      if (!req.files) {
        updatePaket = await Paket.findByIdAndUpdate(paketId, { judul, tanggal, harga }, { new: true });
      } else {
        const oldPaket = await Paket.findById(paketId);
        fs.unlink(path.join(__dirname, "..", "/uploads", oldPaket.gambar), async (err) => {
          if (err) {
            return next(new HttpError(err));
          }
        });
        //upload gambar baru
        const { gambar } = req.files;
        if (gambar.size > 2000000) {
          return next(new HttpError("Ukuran Gambar Terlalu Besar"));
        }
        fileName = gambar.name;
        let splittedFilename = fileName.split(".");
        newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1];
        gambar.mv(path.join(__dirname, "..", "/uploads", newFilename), async (err) => {
          if (err) {
            return next(new HttpError(err));
          }
        });
        updatePaket = await Paket.findByIdAndUpdate(paketId, { judul, tanggal, harga, gambar: newFilename }, { new: true });
      }
    }
    if (!updatePaket) {
      return next(new HttpError("Tidak Bisa Update Paket ", 400));
    }

    res.status(200).json(updatePaket);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// detele paket api/paket/:id
const deletePaket = async (req, res, next) => {
  try {
    const paketId = req.params.id;
    if (!paketId) {
      return next(new HttpError("Paket Tidak Tersedia", 400));
    }
    const paket = await Paket.findById(paketId);
    const fileName = paket?.gambar;
    if (req.user.id) {
      fs.unlink(path.join(__dirname, "..", "/uploads", fileName), async (err) => {
        if (err) {
          return next(new HttpError(err));
        } else {
          await Paket.findByIdAndDelete(paketId);
          res.json(`Paket ${paketId} deleted`);
        }
      });
    } else {
      return next(new HttpError("Paket Tidak Bisa Dihapus", 403));
    }
    //delete gambar
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = { createPaket, getPaket, getSingle, editPaket, deletePaket };
