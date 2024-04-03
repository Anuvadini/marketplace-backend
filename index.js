import express from "express";
import mongoose from "mongoose";
import User from "./Modals/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";
import fs from "fs";
import { createFolder } from "./Utils/directoryManagement.js";
import connectDB from "./Utils/Dbconnection.js";

const app = express();
app.use(express.json());
app.use(cors());
const USERDATAFOLDER = "users";
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY
// MongoDB connection
connectDB()

createFolder(USERDATAFOLDER);

// Sign-Up Endpoint
app.post("/sign-up", async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    const dirPath = createFolder(`${USERDATAFOLDER}/${email}`);
    console.log("test",dirPath)
    const user = new User({ email, password, userType, dirPath });
    await user.save();
    const token = jwt.sign({ id: user._id }, JWT_PRIVATE_KEY, { expiresIn: "1h" });
    res.status(201).json({ token });
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
    const token = jwt.sign({ id: user._id }, JWT_PRIVATE_KEY, { expiresIn: "10h" });
    res.json({ token, userType: user.userType });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access denied");
  try {
    const verified = jwt.verify(token, JWT_PRIVATE_KEY);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

const uploadFile = async (req, res, fileType) => {
  try {
    const { filename, buffer ,userid} = req.body;
    const user = await User.findById(userid);
    const filePath = `${user.dirPath}/${fileType}/file`; // Assuming you want to name the file "file"
    createFolder(`${user.dirPath}/${fileType}`);
    fs.writeFileSync(filePath, buffer);
    res.json({ filePath });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

app.post("/upload-profile-photo", async (req, res) => {
  uploadFile(req, res, "ProfilePic");
});

app.post("/upload-business-logo", async (req, res) => {
  uploadFile(req, res, "BusinessLogo");
});

// MULTIPLE FILE UPLOAD
app.post("/upload-file", async (req, res) => {
  try {
    const { filename, buffer ,userid} = req.body;
    const user = await User.findById(userid);
    const filePath = `${user.dirPath}/Files/${filename}`;
    createFolder(`${user.dirPath}/Files`);
    fs.writeFileSync(filePath, buffer);
    res.json({ filePath });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.put("/update-user-data", async (req, res) => {
  try {
    
    const {
      businessName,
      profilePhoto,
      contactPerson,
      designation,
      qualification,
      specialization,
      experienceYears,
      buisnessEmail,
      youtubeVideoLink,
      contactNumber,
      address,
      city,
      state,
      country,
      pinCode,
      services,
      professionalMemberships,
      awardsAndAchievements,
      keywords,
      files,
      companyDescription,
      userid
    } = req.body;
    const user = await User.findById(userid);
    user.businessName = businessName;
    user.profilePhoto = profilePhoto;
    user.contactPerson = contactPerson;
    user.designation = designation;
    user.qualification = qualification;
    user.specialization = specialization;
    user.experienceYears = experienceYears;
    user.buisnessEmail = buisnessEmail;
    user.youtubeVideoLink = youtubeVideoLink;
    user.contactNumber = contactNumber;
    user.address = address;
    user.city = city;

    user.state = state;
    user.country = country;
    user.pinCode = pinCode;
    user.services = services;
    user.professionalMemberships = professionalMemberships;
    user.awardsAndAchievements = awardsAndAchievements;
    user.keywords = keywords;
    user.files = files;
    user.companyDescription = companyDescription;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
