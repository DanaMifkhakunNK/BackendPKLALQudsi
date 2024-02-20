const jwt = require("jsonwebtoken");
const HttpError = require("../models/errorModel");

const authMiddleware = async (res, req, next) => {
  const Authorization = req.headers.Authorization || req.headers.authorization;

  if (Authorization && Authorization.startWith("Bearer")) {
    const token = Authorization.split("  ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
      if (err) {
        return next(new HttpError("Unathorized", 403));
      }

      req.user = info;
      next();
    });
  } else {
    return next(new HttpError("No token", 403));
  }
};

module.exports = authMiddleware;
