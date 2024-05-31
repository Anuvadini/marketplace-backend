import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  saveManualForm,
  saveFilledManualForm,
  fetchManualForms,
  fetchManualFormsFilled,
  addGeneratedForms,
  fetchAutoForms,
  saveFilledAIForm,
  fetchAIForms,
  fetchAIFormsFilled,
} from "../controllers/formController.js";

const router = express.Router();

router.post("/save-manually-created-form", verifyToken, saveManualForm);
router.post("/save-filled-manual-form", saveFilledManualForm);
router.post("/save-filled-ai-form", saveFilledAIForm);
router.post("/fetch-manual-forms", fetchManualForms);
router.post("/fetch-ai-forms", fetchAIForms);
router.post("/fetch-manual-forms-filled", fetchManualFormsFilled);
router.post("/fetch-ai-forms-filled", fetchAIFormsFilled);
router.post("/add-generated-forms", verifyToken, addGeneratedForms);
router.get("/fetch-auto-forms", fetchAutoForms);

export default router;
