import mongoose from "mongoose";

const riskSchema = mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        severity: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            required: true,
        },
        category: {
            type: String, // e.g., "Financial", "Safety", "Weather"
        },
        identifiedDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ["Open", "Mitigated", "Closed"],
            default: "Open",
        },
    },
    {
        timestamps: true,
    }
);

const Risk = mongoose.model("Risk", riskSchema);

export default Risk;
