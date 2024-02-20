//Unsupported 404
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

//midlleware to handle error
const erroHandler = (error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500).json({ message: error.message || "an unknown error occured" });
};

module.exports = { notFound, erroHandler };
