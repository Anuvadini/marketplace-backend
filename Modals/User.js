import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true },
  dirPath: { type: String, required: true },
  fullname: { type: String, required: true },
  mobilenumber: { type: String, required: true },
  gender: { type: String, required: true },
  language: { type: String, required: true },
  businessName: String,
  businessURL: String, // Added
  profilePhoto: String, // Note: This was previously in your model. Adjust as needed.
  businessLogo: String, // Added
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
  pinCode: String,
  autoForms: [], // No change needed if the frontend sends an array
  manualForms: [], // No change needed if the frontend sends an array
  manualFormsFilled: [], // No change needed if the frontend sends an array
  appointments: [], // No change needed if the frontend sends an array
  services: [String], // No change needed if the frontend sends an array
  professionalMemberships: [String], // No change needed if the frontend sends an array
  awardsAndAchievements: [String], // No change needed if the frontend sends an array
  keywords: [String], // No change needed if the frontend sends an array
  files: [String], // Assuming file paths. No change if the frontend sends an array
  companyDescription: String,
  availableHours: [], // Assuming this remains an array of strings or objects as per the design
  availableDays: [], // Same as above
  collectionName: String,
  appointments: [],
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
