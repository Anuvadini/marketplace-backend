import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createFolder } from "../utils/directoryManagement.js";

export const signUp = async (req, res) => {
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
    const dirPath = createFolder(`users/${email}`);
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      userType,
      fullname,
      mobilenumber,
      gender,
      language,
      dirPath,
    });
    const response = await user.save();
    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ token, userType });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Authentication failed");
    }
    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, userType: user.userType });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
