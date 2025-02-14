require("dotenv").config();
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const app = express();
const upload = multer({ dest: "uploads/" });
const { GoogleGenerativeAI, DynamicRetrievalMode } = require("@google/generative-ai");
const { log } = require("console");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


function fileToGenerativePart(path, mimeType) {
    try {
        return {
            inlineData: {
                data: (fs.readFileSync(path)).toString("base64"),
                mimeType,
            },
        };
    } catch (error) {
        console.error("Error reading file:", error);
        throw error;
    }
}

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, "dist")));

// Analyze endpoint
app.post("/analyze", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Read the prompt.json inside the route
        const promptData = await fs.promises.readFile("./prompt.json", "utf8");
        const promptText = JSON.parse(promptData);

        const AnalysisModel = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: promptText["system_instructions"]
        }, { apiVersion: "v1beta" });

        // Convert image to Base64
        const imageData = fileToGenerativePart(req.file.path, req.file.mimetype);

        

        const response = await AnalysisModel.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: promptText["system_prompt"] },
                        imageData
                    ]
                }
            ],
            generationConfig: {
                maxOutputTokens: 8192,
                temperature: 0.5
            }
        });
        // Extract and parse the response
        let responseText = response["response"]["candidates"][0]["content"]["parts"][0]["text"] || "{}";
        responseText = responseText.replace(/```/g, "");
        responseText = responseText.replace('json', "");
        
        let structuredResponse = JSON.parse(responseText)


        // Create final response with defaults for missing fields
        const finalResponse = {
            product_name: structuredResponse["product_name"] || "Unknown",
            product_category: structuredResponse["product_category"] || "Unknown",
            estimated_carbon_footprint_kgCO2: structuredResponse["estimated_carbon_footprint_kgCO2"] || 0,
            water_usage_liters: structuredResponse["water_usage_liters"] || 0,
            recyclability: {
                is_recyclable: structuredResponse["recyclability"]["is_recyclable"] || false,
                recycled_content_percentage: structuredResponse["recyclability"]["recycled_content_percentage"] || 0,
                recycling_instructions: structuredResponse["recyclability"]["recycling_instructions"] || "No instructions available"
            },
            materials: {
                primary_material: structuredResponse.materials["primary_material"] || "Unknown",
                sustainable_materials_percentage: structuredResponse["materials"]["sustainable_materials_percentage"] || 0,
                biodegradable: structuredResponse.materials["biodegradable"] || false
            },
            sustainability_score: structuredResponse["sustainability_score"] || 0,
            improvement_suggestions: structuredResponse["improvement_suggestions"] || [],
            confidence_score: structuredResponse["confidence_score"] || 0
        };

        // Clean up uploaded file
        await fs.promises.unlink(req.file.path);

        // Send the response
        res.json({
            message: "Image analyzed successfully",
            analysis: finalResponse
        });

    } catch (error) {
        // Clean up uploaded file in case of error
        if (req.file) {
            await fs.promises.unlink(req.file.path);
        }
        console.error("Error analyzing image:", error?.response?.data || error?.message);
        res.status(500).json({ error: error?.response?.data || "Failed to analyze image" });
    }
});

// Serve index.html for the root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Redirect all other routes to the root
app.get("*", (req, res) => {
    res.redirect("/");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
