const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const User = require("./models/User");
const bcryp = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["get", "post"],
  })
);
app.use("/files", express.static("files"));

app.use(express.json());
app.use(cookieParser());

const mongoDBUrl =
  "mongodb+srv://dipind2023:YTXmYnp8kA0WAUTo@cluster0.m5il8lh.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

//multer
const multer = require("multer");
const { decode } = require("punycode");
// const upload = multer({ dest: "./files" });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

require("./models/pdfDetails");
const PdfSchema = mongoose.model("PdfDetails");

const upload = multer({ storage: storage });

function authenticateToken(req, res, next) {
  const token = req.cookies.token; // Assuming you send the token in the 'Authorization' header
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, "secret123", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user; // Store the user's information in the request object
    next();
  });
}

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  console.log("token", token);
  if (!token) {
    return res.json("token is not found");
  } else {
    jwt.verify(token, "secret123", (err, decode) => {
      if (err) {
        return res.json("token is wrong");
      }
    });
    next();
  }
};

app.get("/home", verifyUser, (req, res) => {
  res.json("success");
});

//server cod for user Registration

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: "error", message: "User already registered" });
    }

    const hash = await bcryp.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    res.status(200).json({ status: "ok", user });
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const passwordMatch = await bcryp.compare(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign({ email: user.email }, "secret123", {
          expiresIn: "1d",
        });
        res.cookie("token", token);
        res
          .status(200)
          .json({ status: "success", token, userId: user._id, user });
      } else {
        res.status(500).json({ status: "password is incorrect" });
      }
    } else {
      res.status(500).json({ status: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
});

// Server code for uploading single pdf file
app.post(
  "/upload-files",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    console.log(req.file);
    const title = req.body.title;
    const filename = req.file.filename;
    const userId = req.body.userId;

    console.log("user id:", userId);

    try {
      await PdfSchema.create({ title: title, pdf: filename, userId: userId });
      res.status(200).json({ status: "ok" });
    } catch (err) {
      res.status(500).json({
        status: err,
        message: "An error occurred while uploading the file.",
      });
    }
  }
);

// Server code for extracting and creating new pdf file
app.post("/extract-pages-and-create-pdf", async (req, res) => {
  const { pdfFile, selectedPages } = req.body;

  try {
    const sanitizedFileName = pdfFile.replace(/^.*[\\\/]/, ""); // Extracts the file name

    const pdfData = fs.readFileSync(`./files/${sanitizedFileName}`);
    const originalPdf = await PDFDocument.load(pdfData);

    // Create a new PDF document for the selected pages
    const newPdf = await PDFDocument.create();

    for (const page of selectedPages) {
      const [copiedPage] = await newPdf.copyPages(originalPdf, [page - 1]);
      newPdf.addPage(copiedPage);
    }

    // Serialize the new PDF to a buffer
    const newPdfData = await newPdf.save();
    res.status(200).json({
      status: "ok",
      newPdfData: Buffer.from(newPdfData).toString("base64"),
    });
  } catch (error) {
    console.error("Error creating PDF:", error); // Log the error
    res.status(500).json({ status: "error", message: "Failed to create PDF" });
  }
});

// Server code for serving the new PDF

app.get("/download-new-pdf", (req, res) => {
  const newPdfData = req.query.newPdfData;

  if (!newPdfData) {
    return res.status(404).send("PDF not found");
  }

  try {
    const byteCharacters = atob(newPdfData);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    res.setHeader("Content-Disposition", "attachment; filename=new_pdf.pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.status(200).end(blob);
  } catch (error) {
    console.error("Error serving PDF for download:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Server code for fetching all uploaded pdf files
app.get("/get-files", authenticateToken, async (req, res) => {
  const userId = req.headers["x-user-id"];
  try {
    PdfSchema.find({ userId: userId }).then((data) => {
      res.status(200).json({ status: "ok", data: data });
    });
  } catch (error) {
    res.status(500).json({
      status: error,
      message: "An error occurred while fetching data.",
    });
  }
});

app.get("/", async (req, res) => {
  res.send("success!!.......");
});

app.listen(5000, () => {
  console.log("server running on the port 5000");
});
