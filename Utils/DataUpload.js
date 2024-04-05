import multer from "multer";
import path from "path";
import fs from "fs";

// Utility function to ensure the directory exists (adjust as necessary)
const ensureDirSync = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const basePath = `users/${req.user.id}/${file.fieldname}`; // file.fieldname would be 'profilePhoto' or 'businessLogo' based on the input name
    ensureDirSync(basePath);
    cb(null, basePath);
  },
  filename: function (req, file, cb) {
    // Naming the file - You could add more logic here based on the file type, user, etc.
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const dynamicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const basePath = `users/${req.user.id}/Files`; // Dynamic directory based on the user
    ensureDirSync(basePath);
    cb(null, basePath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.originalname.replace(path.extname(file.originalname), "") +
        "-" +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});

const uploadDynamicFiles = multer({ storage: dynamicStorage });

export { upload, uploadDynamicFiles };
