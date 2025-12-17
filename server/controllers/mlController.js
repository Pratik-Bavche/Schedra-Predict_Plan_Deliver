import { PythonShell } from "python-shell";
import asyncHandler from "express-async-handler";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Run generic prediction model
// @route   POST /api/predict
// @access  Public
const runPrediction = asyncHandler(async (req, res) => {
    const { complexity, inflation, base_cost } = req.body;

    // Path to python script. 
    // We assume server is running from 'server' directory, so script is in ./python/predict.py
    // Adjust path relative to this controller file: ../python/predict.py
    const scriptPath = path.join(__dirname, "../python/predict.py");

    const options = {
        mode: "text",
        pythonOptions: ["-u"], // get print results in real-time
        args: [JSON.stringify({ complexity, inflation, base_cost })],
    };

    PythonShell.run(scriptPath, options).then((messages) => {
        // results is an array consisting of messages collected during execution
        try {
            const result = JSON.parse(messages[0]);
            res.json(result);
        } catch (e) {
            res.status(500);
            throw new Error("Failed to parse Python output");
        }
    }).catch((err) => {
        res.status(500);
        throw new Error(`Python Logic Error: ${err.message}`);
    });
});

export { runPrediction };
