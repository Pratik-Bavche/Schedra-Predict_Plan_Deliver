import Project from "../models/Project.js";
import asyncHandler from "express-async-handler";

// @desc    Get Dashboard Analytics
// @route   GET /api/analytics
// @access  Public
const getAnalytics = asyncHandler(async (req, res) => {
    // 1. Status Distribution
    const statusDistribution = await Project.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);

    // 2. Risk Distribution
    const riskDistribution = await Project.aggregate([
        {
            $group: {
                _id: "$riskLevel",
                count: { $sum: 1 },
            },
        },
    ]);

    // 3. Total Budget & Projects
    const totals = await Project.aggregate([
        {
            $group: {
                _id: null,
                totalBudget: { $sum: "$budget" },
                avgProgress: { $avg: "$progress" },
                totalProjects: { $sum: 1 },
            },
        },
    ]);

    // 4. Projects by Due Month (for timeline chart)
    // Note: Simple grouping by month/year
    const timeline = await Project.aggregate([
        {
            $group: {
                _id: {
                    month: { $month: "$dueDate" },
                    year: { $year: "$dueDate" }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json({
        statusDistribution,
        riskDistribution,
        overview: totals[0] || { totalBudget: 0, avgProgress: 0, totalProjects: 0 },
        timeline
    });
});

export { getAnalytics };
