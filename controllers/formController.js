import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";

export const saveManualForm = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.manualForms) user.manualForms = [];
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
};

export const saveFilledManualForm = async (req, res) => {
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
};

export const saveFilledAIForm = async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    user.autoFormsFilled.push({
      formID: req.body.formID,
      formData: req.body.formData,
    });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const fetchManualForms = async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    res.json(user.manualForms);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const fetchManualFormsFilled = async (req, res) => {
  try {
    const user = await User.findById(req.body.findid);
    res.json({
      manualForms: user.manualForms,
      formResponses: user.manualFormsFilled,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const addGeneratedForms = async (req, res) => {
  try {
    const { aiform } = req.body;
    const user = await User.findById(req.user.id);
    if (!user.autoForms) user.autoForms = [];
    user.autoForms = aiform;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const fetchAutoForms = async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    res.json(user.autoForms);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const fetchAIForms = async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findById(req.body.id);
    res.json(user.autoForms);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const fetchAIFormsFilled = async (req, res) => {
  try {
    const user = await User.findById(req.body.findid);
    res.json({
      autoForms: user.autoForms,
      formResponses: user.autoFormsFilled,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
