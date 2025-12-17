// Simple E2E Verification Script
const BASE_URL = "http://localhost:5000/api";

const runTest = async () => {
    console.log("🚀 Starting System Verification...");

    try {
        // 1. Initial Count
        console.log("\n1. Fetching Projects...");
        const initialRes = await fetch(`${BASE_URL}/projects`);
        const initialProjects = await initialRes.json();
        console.log(`   Initial Count: ${initialProjects.length}`);

        // 2. Create Project
        console.log("\n2. Creating Test Project...");
        const newProject = {
            projectId: "TEST-999",
            name: "Integration Test Project",
            budget: 50000,
            dueDate: "2025-12-31",
            riskLevel: "Low",
            description: "Automated test project"
        };
        const createRes = await fetch(`${BASE_URL}/projects`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProject)
        });
        const createdProject = await createRes.json();

        if (!createdProject._id) throw new Error("Failed to create project");
        console.log(`   Created: ${createdProject.name} (ID: ${createdProject._id})`);

        // 3. Verify ML Bridge
        console.log("\n3. Testing ML Prediction...");
        const predictRes = await fetch(`${BASE_URL}/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ complexity: 5, inflation: 2, base_cost: 50000 })
        });
        const prediction = await predictRes.json();

        if (!prediction.risk_score) throw new Error("ML Prediction failed");
        console.log(`   Prediction Received: Risk Score ${prediction.risk_score}`);

        // 4. Verify Analytics
        console.log("\n4. Fetching Analytics...");
        const analyticsRes = await fetch(`${BASE_URL}/analytics`);
        const analytics = await analyticsRes.json();

        if (!analytics.overview) throw new Error("Analytics failed");
        console.log(`   Analytics OK: Total Budget $${analytics.overview.totalBudget}`);

        // 5. Cleanup
        console.log("\n5. Cleaning up (Deleting Test Project)...");
        const deleteRes = await fetch(`${BASE_URL}/projects/${createdProject._id}`, {
            method: "DELETE"
        });
        const deleteResult = await deleteRes.json();
        console.log(`   ${deleteResult.message}`);

        console.log("\n✅ SYSTEM VERIFICATION SUCCESSFUL");

    } catch (error) {
        console.error("\n❌ VERIFICATION FAILED:", error.message);
        process.exit(1);
    }
};

runTest();
