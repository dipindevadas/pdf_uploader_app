const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "userData" },
  },
  {
    collection: "users",
  }
);

const model = mongoose.model("userData", User);

module.exports = model;
