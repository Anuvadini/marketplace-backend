import express from "express";
import mongoose from "mongoose";
import User from "./Modals/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from "fs";
import cors from "cors";
import { createFolder } from "./Utils/directoryManagement.js";
import { upload, uploadDynamicFiles } from "./Utils/DataUpload.js";
import connectDB from "./Utils/DBconnection.js";
import { uploadFilesToRag } from "./Utils/RagDB.js";
import { fileURLToPath } from "url";
import path, { dirname, join } from "path";
import { v4 as uuidv4 } from "uuid";
import command from "nodemon/lib/config/command.js";
import sendEmail from "./Utils/Mailer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DEBUG = false;

const app = express();
app.use(cors());
app.use(express.json());

const USERDATAFOLDER = "users";

connectDB();

createFolder(USERDATAFOLDER);

// Sign-Up Endpoint
app.use("/file", express.static(join(__dirname, "uploads")));

// email
// password
// userType
// fullname
// mobilenumber
// gender
// language
app.post("/sign-up", async (req, res) => {
  try {
    const {
      email,
      password,
      userType,
      fullname,
      mobilenumber,
      gender,
      language,
    } = req.body;

    console.log(req.body);

    const dirPath = createFolder(`${USERDATAFOLDER}/${email}`);
    const user = new User({
      email,
      password,
      userType,
      fullname,
      mobilenumber,
      gender,
      language,
      dirPath,
    });
    const response = await user.save();
    console.log(response);
    const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "1h" });
    res.status(201).json({ token, userType });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Sign-In Endpoint
app.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Authentication failed");
    }
    const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "1h" });
    res.json({ token, userType: user.userType });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const verifyToken = (req, res, next) => {
  if (DEBUG) {
    req.user = { id: "testuser" };
    return next();
  }
  let token = req.header("Authorization");
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  if (!token) return res.status(401).send("Access denied");
  try {
    const verified = jwt.verify(token, "secretKey");
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

app.post(
  "/upload-profile-photo",
  verifyToken,
  upload.single("profilePhoto"),
  async (req, res) => {
    try {
      if (!req.file) throw new Error("File is required");
      const filePath = req.file.path;
      res.json({ filePath });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

app.post(
  "/upload-business-logo",
  verifyToken,
  upload.single("businessLogo"),
  async (req, res) => {
    try {
      if (!req.file) throw new Error("File is required");
      const filePath = req.file.path;
      res.json({ filePath });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

app.post(
  "/upload-files",
  verifyToken,
  uploadDynamicFiles.array("files", 10),
  async (req, res) => {
    try {
      if (req.files.length === 0)
        throw new Error("At least one file is required.");
      const filePaths = req.files.map((file) => file.path);
      console.log(req.user);
      const user = await User.findById(req.user.id);
      const document_id = await uploadFilesToRag(filePaths, user.email);
      const collection_name = user.email + "_" + document_id;
      console.log(collection_name);
      user.collectionName = collection_name;
      await user.save();
      res.json({ filePaths });
    } catch (errouserDBr) {
      res.status(400).send(error.message);
    }
  }
);

app.put("/update-user-data", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const {
      businessName,
      businessURL,
      profilePhoto, // Previously profilePhoto
      businessLogo,
      contactPerson, // Previously contactPerson
      designation,
      qualification,
      specialization,
      experienceYears, // Previously experienceYears
      emailId, // Previously buisnessEmail
      youtubeVideoLink,
      contactNumber,
      address,
      city,
      state,
      district, // New field not previously handled
      pinCode,
      services, // Previously services
      availableHours,
      availableDays,
      professionalMemberships,
      awardsAndAchievements,
      keywords,
      files, // Previously files
      companyDescription,
    } = req.body;

    console.log(req.body);

    user.businessName = businessName;
    user.businessURL = businessURL; // Added
    user.profilePhoto = profilePhoto; // Assuming this is intended as the main profile/business logo
    user.businessLogo = businessLogo; // Assuming this is intended as the secondary logo
    user.contactPerson = contactPerson;
    user.designation = designation;
    user.qualification = qualification;
    user.specialization = specialization;
    user.experienceYears = experienceYears;
    user.buisnessEmail = emailId;
    user.youtubeVideoLink = youtubeVideoLink;
    user.contactNumber = contactNumber;
    user.address = address;
    user.city = city;
    user.state = state;
    user.district = district; // Updated to handle district
    user.pinCode = pinCode;
    if (services) {
      user.services = services.split(",");
    } else {
      user.services = [];
    }

    if (professionalMemberships) {
      user.professionalMemberships = professionalMemberships.split(",");
    } else {
      user.professionalMemberships = [];
    }

    if (awardsAndAchievements) {
      user.awardsAndAchievements = awardsAndAchievements.split(",");
    } else {
      user.awardsAndAchievements = [];
    }
    user.keywords = keywords;
    user.files = files;
    user.companyDescription = companyDescription;
    user.availableHours = availableHours;
    user.availableDays = availableDays;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// save manually created form data
app.post("/save-manually-created-form", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // check if manualForms is not defined
    if (!user.manualForms) {
      user.manualForms = [];
    }
    user.manualForms.push({
      formID: uuidv4(),
      formName: req.body.formName,
      formData: req.body.formData,
      formDescription: req.body.formDescription,
    });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// save filled manually created form data
app.post("/save-filled-manual-form", async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    user.manualFormsFilled.push({
      formID: req.body.formID,
      formData: req.body.formData,
    });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// get all manually created forms
app.post("/fetch-manual-forms", async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    res.json(user.manualForms);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
app.post("/add-generated-forms", verifyToken, async (req, res) => {
  try {
    const { formid } = req.body;
    console.log(formid);
    const user = await User.findById(req.user.id);
    if (!user.autoForms) {
      user.autoForms = [];
    }
    user.autoForms.push(formid);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
// get all auto generated forms
app.get("/fetch-auto-forms", async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    res.json(user.autoForms);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// book appointment
app.post("/book-appointment", async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    const formdata = req.body.FormData;
    user.appointments.push({
      appointmentID: uuidv4(),
      appointmentDate: formdata.appointmentDate,
      appointmentTime: formdata.appointmentTime,
      firstname: formdata.firstname,
      lastname: formdata.lastname,
      mobile: formdata.mobile,
      company: formdata.company,
      website: formdata.website,
      discussion: formdata.discussion,
    });

    await user.save();

    sendEmail(
      user.email,
      "Appointment Booked with " + user.businessName,
      `Your appointment has been booked successfully. The merchant will respond with the confirmation soon.`
    );

    res.json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/fetch-list", async (req, res) => {
  try {
    let users = await User.find({ userType: "1" });
    // get users with type Merchant
    const merchants = await User.find({ userType: "merchant" });
    users = users.concat(merchants);
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/users/:userId/profilePhoto/:filename", (req, res) => {
  const { userId, filename } = req.params;
  const filePath = path.join(
    __dirname,
    "users",
    userId,
    "profilePhoto",
    filename
  );

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(err);
      return res.status(404).send("File not found.");
    }
    // Serve the file
    res.sendFile(filePath);
  });
});

app.get("/users/:userId/businessLogo/:filename", (req, res) => {
  const { userId, filename } = req.params;
  const filePath = path.join(
    __dirname,
    "users",
    userId,
    "businessLogo",
    filename
  );

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(err);
      return res.status(404).send("File not found.");
    }
    // Serve the file
    res.sendFile(filePath);
  });
});
app.get("/file/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "users", filename); // Adjust as per your directory structure

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(err);
      return res.status(404).send("File not found.");
    }
    // Serve the file
    res.sendFile(filePath);
  });
});

// get available time list of merchant
app.post("/fetch-available-time", async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findById(req.body.id);
    res.json({ availableHours: user.availableHours });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/fetch-user-data", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
const PORT = process.env.PORT || 3232;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
