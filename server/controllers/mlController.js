import asyncHandler from "express-async-handler";

// @desc    Run generic prediction model
// @route   POST /api/predict
// @access  Public
const runPrediction = asyncHandler(async (req, res) => {
    const { complexity = 1, inflation = 0, base_cost = 100000 } = req.body;

    // JavaScript implementation of previous Python mock logic
    // Eliminates the need for python-shell on Vercel deployment

    const predicted_cost = base_cost * (1 + (inflation / 100));
    const predicted_delay_days = complexity * 2.5;
    const risk_score = (complexity * 10) + inflation;

    const result = {
        "predicted_cost": parseFloat(predicted_cost.toFixed(2)),
        "predicted_delay_days": Math.round(predicted_delay_days),
        "risk_score": parseFloat(risk_score.toFixed(2)),
        "status": "Success",
        "model_version": "v2.0-js-native"
    };

    // Simulate slight processing delay for realism/UX if desired, 
    // but redundant since frontend adds artificial delay too.
    res.json(result);
});

export { runPrediction };
