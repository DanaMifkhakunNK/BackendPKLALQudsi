//Login api/users/login Unprotected
const bcrypt = require("bcryptjs");
const HttpError = require("../models/errorModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const newEmail = email.toLowerCase();
    const user = await User.findOne({ email: newEmail });
    if (!user) {
      return next(new HttpError("Cek Kembali Email Anda!.", 422));
    }
    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return next(new HttpError("Password Anda Salah!.", 422));
    }
    const { _id: id, name } = user;
    const token = jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({ token, id, name });
  } catch (error) {
    return next(new HttpError("Login Gagal ", 422));
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(new HttpError("fill in all fields", 422));
    }
    const newEmail = email.toLowerCase();
    const emailExist = await User.findOne({ email: newEmail });
    if (emailExist) {
      return next(new HttpError("Email Alredy exists", 422));
    }

    if (password.trim().length < 6) {
      return next(new HttpError("Password should be at least 6  ", 422));
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const newUser = await User.create({ name, email: newEmail, password: hashedPass });
    res.status(201).json(newUser);
  } catch (error) {
    return next(new HttpError("User Registrasi failed", 422));
  }
};

module.exports = { loginUser, registerUser };
