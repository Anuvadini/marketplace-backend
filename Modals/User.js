import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true },
  dirPath: { type: String, required: true },

  businessName: String,
  profilePhoto: String,

  collectionName: String,

  contactPerson: String,
  designation: String,
  qualification: String,
  specialization: String,
  experienceYears: Number,
  buisnessEmail: String,
  youtubeVideoLink: String,
  contactNumber: String,
  address: String,
  city: String,
  state: String,
  district: String,

  manualForms: [],
  autoForms: [],

  availableHours: [],
  availableDays: [],

  pinCode: String,
  services: [String], // Assuming services offered are multiple
  professionalMemberships: [String],
  awardsAndAchievements: [String], // Assuming multiple awards/publications
  keywords: [String],
  files: [String], // Assuming file paths are stored as strings
  companyDescription: String,
});

// Pre-save hook to hash password before saving a user document
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
