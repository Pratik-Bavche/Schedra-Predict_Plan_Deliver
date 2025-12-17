import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // Note: Adjust path if running from root or server dir
import Project from "./models/Project.js";
import "colors";

dotenv.config();

connectDB();

const projects = [
    {
        projectId: "PROJ-782",
        name: "Substation Alpha Renewal",
        status: "In Progress",
        riskLevel: "Medium",
        budget: 1200000,
        progress: 45,
        dueDate: new Date("2025-06-15"),
        description: "Full renewal of Alpha substation components."
    },
    {
        projectId: "PROJ-783",
        name: "Transmission Line - Sector 4",
        status: "Delayed",
        riskLevel: "High",
        budget: 3500000,
        progress: 20,
        dueDate: new Date("2025-08-01"),
        description: "New 400kV line construction."
    },
    {
        projectId: "PROJ-784",
        name: "Grid Maintenance South",
        status: "Completed",
        riskLevel: "Low",
        budget: 450000,
        progress: 100,
        dueDate: new Date("2024-12-10"),
        description: "Routine maintenance for Q4."
    }
];

const importData = async () => {
    try {
        await Project.deleteMany(); // Clear existing
        await Project.insertMany(projects);

        console.log("Data Imported!".green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Project.deleteMany();
        console.log("Data Destroyed!".red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === "-d") {
    destroyData();
} else {
    importData();
}
