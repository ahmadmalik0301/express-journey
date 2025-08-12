import express from "express";
import registrationController from "./registrationController.js";
const router = express.Router();
router.post("/", registrationController);
export default router;
