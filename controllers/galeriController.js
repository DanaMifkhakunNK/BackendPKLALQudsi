const path = require("path");
const fs = require("fs");
const User = require("../models/userModel");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel");
const galeriModel = require("../models/galeriModel");

const createGaleri = async (req, res, next) => {
  try {
    const { galeri } = req.files;
    if (galeri.size > 2000000) {
      return next(new HttpError("ukuran gambar terlalu besar"));
    }
    let fileName = galeri.name;
    let splittedFilename = fileName.split(".");
    let newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1];
    galeri.mv(path.join(__dirname, "..", "/galeri", newFilename), async (err) => {
      if (err) {
        return next(new HttpError(err));
      } else {
        const newGaleri = await galeriModel.create({ galeri: newFilename });
        if (!newGaleri) {
          return next(new HttpError("gagal menambahkan galeri", 422));
        }

        res.status(201).json(newGaleri);
      }
    });
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getGaleri = async (req, res, next) => {
  try {
    const galeris = await galeriModel.find().sort({ updatedAt: -1 });
    res.status(200).json(galeris);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const deleteGaleri = async (req, res, next) => {
  try {
    const galeriId = req.params.id;
    if (!galeriId) {
      return next(new HttpError("Galeri Tidak Tersedia", 400));
    }
    const paket = await galeriModel.findById(galeriId);
    const fileName = paket?.galeri;
    if (req.user.id) {
      fs.unlink(path.join(__dirname, "..", "/galeri", fileName), async (err) => {
        if (err) {
          return next(new HttpError(err));
        } else {
          await galeriModel.findByIdAndDelete(galeriId);
          //find paket
          const currentUser = await galeriModel.findById(req.user.id);
          const userGaleriCount = currentUser?.galeri - 1;
          await galeriModel.findByIdAndUpdate(req.user.id, { paket: userGaleriCount });
          res.json(`Galeri ${galeriId} deleted`);
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

module.exports = { createGaleri, getGaleri, deleteGaleri };
