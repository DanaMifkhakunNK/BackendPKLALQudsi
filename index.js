const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
require("dotenv").config();
const upload = require("express-fileupload");
const userRoutes = require("./routes/usersRouters");
const paketRoutes = require("./routes/paketRouters");
const galeriRoutes = require("./routes/galeriRouters");
const { notFound, erroHandler } = require("./middleware/errorMiddleware");

const app = express();
app.use(express.json({ extends: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(upload());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/galeri", express.static(__dirname + "/galeri"));
app.use("/api/users", userRoutes);
app.use("/api/paket", paketRoutes);
app.use("/api/galeri", galeriRoutes);

app.use(notFound);
app.use(erroHandler);

connect(process.env.database)
  .then(app.listen(process.env.PORT || 5000, () => console.log(`Server on port ${process.env.PORT}`)))
  .catch((error) => {
    console.log(error);
  });
