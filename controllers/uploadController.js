import { upload, uploadDynamicFiles } from "../utils/dataUpload.js";
import { uploadFilesToRag } from "../Utils/ragDB.js";
import User from "../models/User.js";

export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) throw new Error("File is required");
    const filePath = req.file.path;
    res.json({ filePath });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const uploadBusinessLogo = async (req, res) => {
  try {
    if (!req.file) throw new Error("File is required");
    const filePath = req.file.path;
    res.json({ filePath });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const uploadFiles = async (req, res) => {
  try {
    if (req.files.length === 0)
      throw new Error("At least one file is required.");
    const filePaths = req.files.map((file) => file.path);
    const user = await User.findById(req.user.id);
    const document_id = await uploadFilesToRag(filePaths, user.email);
    const collection_name = `${user.email}_${document_id}`;
    user.collectionName = collection_name;
    await user.save();
    res.json({ filePaths });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
