const mongoose = require("mongoose");

const pdfDetailsSchema = new mongoose.Schema(
  {
    pdf: String,
    title: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { collection: "PdfDetails" }
);

mongoose.model("PdfDetails", pdfDetailsSchema);
