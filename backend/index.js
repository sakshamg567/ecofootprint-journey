require("dotenv").config();
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static(path.join(__dirname, "dist")));

app.post("/analyze", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Convert image to Base64
        const imageBase64 = fs.readFileSync(req.file.path, { encoding: "base64" });

        // Strict prompt to enforce JSON format
        const promptText = `Analyze the image and provide detailed sustainability metrics for the product.
        The response **must always** be a JSON object with these **exact keys**:
        {
          "product_name": "string (detected product name)",
          "product_category": "string (category of product)",
          "estimated_carbon_footprint_kgCO2": "number (total carbon footprint in kg CO2)",
          "water_usage_liters": "number (estimated water consumption in production)",
          "recyclability": {
            "is_recyclable": "boolean",
            "recycled_content_percentage": "number (0-100)",
            "recycling_instructions": "string"
          },
          "materials": {
            "primary_material": "string",
            "sustainable_materials_percentage": "number (0-100)",
            "biodegradable": "boolean"
          },
          "sustainability_score": "number (0-100 overall sustainability rating)",
          "improvement_suggestions": ["string (list of sustainability improvement recommendations)"],
          "confidence_score": "number (confidence level between 0-1)"
        }
        Do NOT return extra text, just a valid JSON response.`

        // Update the finalResponse to include default values for all new fields
        const finalResponse = {
            product_name: structuredResponse.product_name || "Unknown",
            product_category: structuredResponse.product_category || "Unknown",
            estimated_carbon_footprint_kgCO2: structuredResponse.estimated_carbon_footprint_kgCO2 || 0,
            water_usage_liters: structuredResponse.water_usage_liters || 0,
            recyclability: {
                is_recyclable: structuredResponse.recyclability?.is_recyclable || false,
                recycled_content_percentage: structuredResponse.recyclability?.recycled_content_percentage || 0,
                recycling_instructions: structuredResponse.recyclability?.recycling_instructions || "No instructions available"
            },
            materials: {
                primary_material: structuredResponse.materials?.primary_material || "Unknown",
                sustainable_materials_percentage: structuredResponse.materials?.sustainable_materials_percentage || 0,
                biodegradable: structuredResponse.materials?.biodegradable || false
            },
            sustainability_score: structuredResponse.sustainability_score || 0,
            improvement_suggestions: structuredResponse.improvement_suggestions || [],
            confidence_score: structuredResponse.confidence_score || 0
        };

        // Define API request
        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: promptText },
                        {
                            inlineData: {
                                mimeType: req.file.mimetype,
                                data: imageBase64,
                            }
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.2,  // Ensure more structured responses
                responseMimeType: "application/json"  // Force JSON format
            }
        };

        // API URL
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

        // Send request to Gemini API
        const response = await axios.post(API_URL, requestBody, {
            headers: { "Content-Type": "application/json" }
        });

        // Extract and parse the response
        let responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

        let structuredResponse;
        try {
            structuredResponse = JSON.parse(responseText);
        } catch (err) {
            structuredResponse = { error: "Invalid JSON response from Gemini." };
        }

        // Ensure response always has the required keys
        res.json({
            message: "Image analyzed successfully",
            analysis: finalResponse
        });

    } catch (error) {
        console.error("Error analyzing image:", error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || "Failed to analyze image" });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"))
})
app.get("*", (req,res) => {
    res.redirect("/")
})

const PORT = process.env.port || 5000;

app.listen(PORT, () => console.log(`Server running on port : ${PORT}`));
