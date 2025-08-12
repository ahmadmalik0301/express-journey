import express, { Router } from "express";
import loginController from "./loginController.js";

const router: Router = express.Router();

router.post("/", loginController);

export default router;
