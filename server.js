import express from "express";
import multer from "multer";
import { uploadFile } from "./services/s3Service.js";
import {
  saveFileData,
  listFiles,
  getFileItem,
} from "./services/dynamoService.js";

const app = express();
const upload = multer();

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // get file from form-data
    const file = req.file;

    // take other fields as user metadata
    const userMetadata = req.body;

    // validate file
    if (!file) {
      return res.status(400).send("File is required.");
    }

    // upload file to S3
    const fileId = await uploadFile(file);

    // prepare and save metadata to dynamodb
    const fileData = {
      fileName: file.originalname,
      uploadedAt: new Date().toISOString(),
      userMetadata,
    };
    saveFileData(fileId, fileData);

    // send object created as response
    res.status(201).json({
      fileId,
      ...fileData,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to upload file" });
    console.log(err);
  }
});

app.get("/files", async (req, res) => {
  try {
    // list all files from dynamodb
    const files = await listFiles();
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve files" });
    console.log(err);
  }
});

app.get("/metadata/:fileId", async (req, res) => {
  try {
    // get metadata of a file from dynamodb
    const fileId = req.params.fileId;
    const fileItem = await getFileItem(fileId);
    res.status(200).json(fileItem);
  } catch (err) {
    if (err.statusCode === 404) {
      return res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Failed to retrieve file" });
      console.log(err);
    }
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
