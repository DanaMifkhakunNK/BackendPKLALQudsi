const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel");
const testiModel = require("../models/testiModel");

const createTesti = (req, res, next) => {
  try {
    let { nama, testimonial } = req.body;
    const { testigambar } = req.files;
    if (testigambar.size > 2000000) {
      return next(new HttpError("ukuran gambar terlalu besar"));
    }
    let fileName = testigambar.name;
    let splittedFilename = fileName.split(".");
    let newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1];
    testigambar.mv(path.join(__dirname, "..", "/testigambar", newFilename), async (err) => {
      if (err) {
        return next(new HttpError(err));
      } else {
        const newPaket = await testiModel.create({ nama, testimonial, testigambar: newFilename });
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

const getTesti = async (req, res, next) => {
  try {
    const testi = await testiModel.find().sort({ updatedAt: -1 });
    res.status(200).json(testi);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const editTesti = async (req, res, next) => {
  try {
    let fileName;
    let newFilename;
    let updateTesti;
    const testiId = req.params.id;
    let { nama, testimonial } = req.body;

    if (req.user.id) {
      if (!req.files) {
        updateTesti = await testiModel.findByIdAndUpdate(testiId, { nama, testimonial }, { new: true });
      } else {
        const oldTesti = await testiModel.findById(testiId);
        fs.unlink(path.join(__dirname, "..", "/testigambar", oldTesti.testigambar), async (err) => {
          if (err) {
            return next(new HttpError(err));
          }
        });
        //upload gambar baru
        const { testigambar } = req.files;
        if (testigambar.size > 2000000) {
          return next(new HttpError("Ukuran Gambar Terlalu Besar"));
        }
        fileName = testigambar.name;
        let splittedFilename = fileName.split(".");
        newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1];
        testigambar.mv(path.join(__dirname, "..", "/testigambar", newFilename), async (err) => {
          if (err) {
            return next(new HttpError(err));
          }
        });
        updateTesti = await testiModel.findByIdAndUpdate(testiId, { nama, testimonial, testigambar: newFilename }, { new: true });
      }
    }
    if (!updateTesti) {
      return next(new HttpError("Tidak Bisa Update Testi ", 400));
    }

    res.status(200).json(updateTesti);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const deleteTesti = async (req, res, next) => {
  try {
    const testiId = req.params.id;
    if (!testiId) {
      return next(new HttpError("Paket Tidak Tersedia", 400));
    }
    const testi = await testiModel.findById(testiId);
    const fileName = testi?.testigambar;
    if (req.user.id) {
      fs.unlink(path.join(__dirname, "..", "/testigambar", fileName), async (err) => {
        if (err) {
          return next(new HttpError(err));
        } else {
          await testiModel.findByIdAndDelete(testiId);
          res.json(`Paket ${testiId} deleted`);
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
module.exports = { createTesti, getTesti, editTesti, deleteTesti };
