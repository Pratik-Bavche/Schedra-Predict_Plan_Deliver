import express from "express";
const router = express.Router();
import { getProjects, getProjectById, createProject, deleteProject, updateProject } from "../controllers/projectController.js";

router.route("/").get(getProjects).post(createProject);
router.route("/:id").get(getProjectById).delete(deleteProject).put(updateProject);

export default router;
