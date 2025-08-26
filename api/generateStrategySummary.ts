// path: /api/generateStrategySummary.ts
import { GoogleGenAI } from "@google/genai";

interface VercelRequest {
    method: string;
    body: {
        title: string;
    };
}

interface VercelResponse {
    status: (statusCode: number) => VercelResponse;
    json: (body: any) => void;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    
    if (!process.env.API_KEY) {
        return res.status(500).json({ message: "API_KEY environment variable not set." });
    }

    try {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Title is required.' });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `
            You are a curriculum designer summarizing a teaching strategy for a weekly preview.
            Your goal is to write a single, compelling sentence that describes the core benefit of the strategy.
            
            **Rules:**
            - The tone should be professional and encouraging.
            - Focus on the main outcome or benefit for teachers or students.
            - Output only the single sentence. No extra formatting or quotation marks.

            **Strategy Title:**
            ${title}

            **Example for a strategy named "Four Corners":**
            Get students moving and sharing their opinions with this engaging whole-class discussion activity.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { temperature: 0.8 }
        });

        const summaryText = response.text;
        if (!summaryText) {
            throw new Error("API returned an empty summary.");
        }

        const summary = summaryText.trim().replace(/^"|"$/g, '');
        return res.status(200).json({ summary });

    } catch (error) {
        console.error("Error in generateStrategySummary API:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ message: `Failed to generate summary: ${errorMessage}` });
    }
}
