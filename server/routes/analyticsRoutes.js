import express from "express";
const router = express.Router();
import { getAnalytics } from "../controllers/analyticsController.js";

router.get("/", getAnalytics);

export default router;
