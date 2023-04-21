require("dotenv").config();
const cors = require("cors");

const express = require("express");
const mongoose = require("mongoose");
const taskRoutes = require("./routes/tasks");
const userRoutes = require("./routes/user");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001",
  })
);
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/tasks", taskRoutes);
app.use("/api/user", userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = app;
