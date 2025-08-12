import express, { Router } from "express";
import registrationController from "./registrationController.js";

const router: Router = express.Router();

router.post("/", registrationController);

export default router;
