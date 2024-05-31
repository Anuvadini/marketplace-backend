import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  updateUserData,
  fetchUserData,
  fetchList,
  bookAppointment,
  fetchAvailableTime,
} from "../controllers/userController.js";

const router = express.Router();

router.put("/update-user-data", verifyToken, updateUserData);
router.get("/fetch-user-data", verifyToken, fetchUserData);
router.get("/fetch-list", fetchList);
router.post("/book-appointment", bookAppointment);
router.post("/fetch-available-time", fetchAvailableTime);
export default router;
