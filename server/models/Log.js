import mongoose from "mongoose";

const logSchema = mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
        },
        source: {
            type: String, // e.g., "Vendor Report", "Permit Log", "Site Inspection"
            required: true,
        },
        content: {
            type: String, // The raw text content
            required: true,
        },
        // Vector embedding placeholder for NLP later
        embedding: {
            type: [Number],
            select: false
        },
        extractedEntities: {
            type: Map, // For storing parsed dates, costs, etc.
            of: String
        }
    },
    {
        timestamps: true,
    }
);

const Log = mongoose.model("Log", logSchema);

export default Log;
