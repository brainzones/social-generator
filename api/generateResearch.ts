// path: /api/generateResearch.ts
import { GoogleGenAI } from "@google/genai";

interface VercelRequest {
    method: string;
    body: {
        title: string;
        howTo: string; // Plain text
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
        const { title, howTo } = req.body;
        if (!title || !howTo) {
            return res.status(400).json({ message: 'Title and HowTo are required.' });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const prompt = `
            You are an expert in educational psychology and neuroscience.
            Analyze the following teaching strategy and generate 3-4 bullet points for a "Research" section that explains the psychological or neurological basis for why it is effective.
            
            The output must be a single HTML string containing only the <li> elements for a bulleted list.
            Each bullet point must be wrapped in <li></li> tags.
            Within each bullet point, identify and wrap the most important 1-3 key concepts in <strong></strong> tags.
            Do not include the surrounding <ul> or <ol> tags in your response. Do not use markdown.

            Here is the strategy:
            
            **Strategy Title:**
            ${title}

            **How-To Steps:**
            ${howTo}

            **Example Output:**
            <li>Commitment bias signing ahead leverages <strong>consistency drives</strong>, reducing pushback.</li><li>Executive control pre-commitment recruits <strong>prefrontal circuits</strong> for automatic follow-through.</li>
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const researchHtml = response.text;
        if (!researchHtml) {
            throw new Error("API returned an empty response.");
        }

        return res.status(200).json({ researchHtml });

    } catch (error) {
        console.error("Error in generateResearch API:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ message: `Failed to generate research points: ${errorMessage}` });
    }
}
