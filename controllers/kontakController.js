const Kontak = require("../models/kontakModel");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel");

const createKontak = async (req, res, next) => {
  try {
    let { alamat, wa, ig, fb } = req.body;
    const { logo } = req.files;
    if (logo.size > 2000000) {
      return next(new HttpError("ukuran gambar terlalu besar"));
    }
    let fileName = logo.name;
    let splittedFilename = fileName.split(".");
    let newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1];
    logo.mv(path.join(__dirname, "..", "/logo", newFilename), async (err) => {
      if (err) {
        return next(new HttpError(err));
      } else {
        const newKontak = await Kontak.create({ alamat, wa, fb, ig, logo: newFilename });
        if (!newKontak) {
          return next(new HttpError("gagal menambahkan kontak", 422));
        }
        res.status(201).json(newKontak);
      }
    });
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getKontak = async (req, res, next) => {
  try {
    const kontaks = await Kontak.find().sort({ updatedAt: -1 });
    res.status(200).json(kontaks);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getSingle = async (req, res, next) => {
  try {
    const kontakId = req.params.id;
    const kontak = await Paket.findById(kontakId);
    if (!kontak) {
      return next(new HttpError("kotak not found", 404));
    }
    res.status(200).json(kontak);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const editKontak = async (req, res, next) => {
  try {
    let fileName;
    let newFilename;
    let updateKontak;
    const kontakId = req.params.id;
    let { alamat, wa, fb, ig } = req.body;

    if (req.user.id) {
      if (!req.files) {
        updateKontak = await Kontak.findByIdAndUpdate(kontakId, { alamat, wa, fb, ig }, { new: true });
      } else {
        const oldKontak = await Kontak.findById(kontakId);
        fs.unlink(path.join(__dirname, "..", "/logo", oldKontak.logo), async (err) => {
          if (err) {
            return next(new HttpError(err));
          }
        });
        //upload gambar baru
        const { logo } = req.files;
        if (logo.size > 2000000) {
          return next(new HttpError("Ukuran Gambar Terlalu Besar"));
        }
        fileName = logo.name;
        let splittedFilename = fileName.split(".");
        newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1];
        logo.mv(path.join(__dirname, "..", "/logo", newFilename), async (err) => {
          if (err) {
            return next(new HttpError(err));
          }
        });
        updateKontak = await Kontak.findByIdAndUpdate(kontakId, { alamat, wa, fb, ig, logo: newFilename }, { new: true });
      }
    }
    if (!updateKontak) {
      return next(new HttpError("Tidak Bisa Update Kontak ", 400));
    }

    res.status(200).json(updateKontak);
  } catch (error) {
    return next(new HttpError(error));
  }
};
module.exports = { createKontak, editKontak, getKontak, getSingle };
