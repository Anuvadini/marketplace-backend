import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  uploadProfilePhoto,
  uploadBusinessLogo,
  uploadFiles,
} from "../controllers/uploadController.js";
import { upload, uploadDynamicFiles } from "../utils/dataUpload.js";

const router = express.Router();

router.post(
  "/upload-profile-photo",
  verifyToken,
  upload.single("profilePhoto"),
  uploadProfilePhoto
);

router.post(
  "/upload-business-logo",
  verifyToken,
  upload.single("businessLogo"),
  uploadBusinessLogo
);

router.post(
  "/upload-files",
  verifyToken,
  uploadDynamicFiles.array("files", 10),
  uploadFiles
);

export default router;
