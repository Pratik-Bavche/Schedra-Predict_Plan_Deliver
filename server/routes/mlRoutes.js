import express from "express";
const router = express.Router();
import { runPrediction } from "../controllers/mlController.js";

router.post("/", runPrediction);

export default router;
