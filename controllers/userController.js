import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import { createFolder } from "../utils/directoryManagement.js";
import { sendEmailto } from "../Utils/mailer.js";

export const updateUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const {
      businessName,
      businessURL,
      profilePhoto,
      businessLogo,
      contactPerson,
      designation,
      qualification,
      specialization,
      experienceYears,
      emailId,
      youtubeVideoLink,
      contactNumber,
      address,
      city,
      state,
      district,
      pinCode,
      services,
      availableHours,
      availableDays,
      professionalMemberships,
      awardsAndAchievements,
      keywords,
      files,
      companyDescription,
    } = req.body;

    Object.assign(user, {
      businessName,
      businessURL,
      profilePhoto,
      businessLogo,
      contactPerson,
      designation,
      qualification,
      specialization,
      experienceYears,
      buisnessEmail: emailId,
      youtubeVideoLink,
      contactNumber,
      address,
      city,
      state,
      district,
      pinCode,
      services: services ? services.split(",") : [],
      professionalMemberships: professionalMemberships
        ? professionalMemberships.split(",")
        : [],
      awardsAndAchievements: awardsAndAchievements
        ? awardsAndAchievements.split(",")
        : [],
      keywords,
      files,
      companyDescription,
      availableHours,
      availableDays,
    });

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const fetchUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.userType === "user") {
      const appointments = user.appointments;
      const merchantAppointments = await Promise.all(
        appointments.map(async (appointment) => {
          const merchant = await User.findById(appointment.merchantId);
          const merchantAppointment = merchant.appointments.find(
            (a) => a.appointmentID === appointment.appointmentID
          );
          return {
            appointmentID: appointment.appointmentID,
            merchantName: merchant.businessName,
            merchantEmail: merchant.email,
            merchantMobile: merchant.mobilenumber,
            discussion: merchantAppointment.discussion,
            appointmentDate: merchantAppointment.appointmentDate,
            appointmentTime: merchantAppointment.appointmentTime,
          };
        })
      );
      return res.json({ ...user._doc, appointments, merchantAppointments });
    }
    res.json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const fetchList = async (req, res) => {
  try {
    let users = await User.find({ userType: "1" });
    const merchants = await User.find({ userType: "merchant" });
    users = users.concat(merchants);
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const bookAppointment = async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    const formdata = req.body.FormData;
    const [datePart, timePart] = formdata.dateandtime
      .split(",")
      .map((part) => part.split(": ")[1].trim());
    const appointmentID = uuidv4();

    user.appointments.push({
      appointmentID,
      appointmentDate: datePart,
      appointmentTime: timePart,
      firstname: formdata.FirstName,
      lastname: formdata.LastName,
      mobile: formdata.MobilePn,
      company: formdata.CompanyName,
      website: formdata.websiteUrl,
      discussion: formdata.DiscusseAbt,
      email: formdata.Email,
    });

    await user.save();

    const randomPassword = Math.random().toString(36).slice(-8);
    const dirPath = createFolder(`users/${formdata.Email}`);
    const newUser = new User({
      email: formdata.Email,
      password: randomPassword,
      dirPath,
      gender: "male",
      language: "en-IN",
      userType: "user",
      fullname: `${formdata.FirstName} ${formdata.LastName}`,
      mobilenumber: formdata.MobilePn,
      appointments: [{ appointmentID, merchantId: req.body.id }],
    });

    await newUser.save();

    sendEmailto(
      formdata.Email,
      formdata.FirstName,
      formdata.dateandtime,
      user.businessName,
      randomPassword
    );

    res.status(200).json({ appointment: user.appointments });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// app.post("/fetch-available-time", async (req, res) => {
//   try {
//     console.log(req.body);
//     console.log(req.body.id);
//     const user = await User.findById(req.body.id);
//     console.log(user);
//     res.json({ availableHours: user.availableHours });
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

export const fetchAvailableTime = async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    res.json({ availableHours: user.availableHours });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
