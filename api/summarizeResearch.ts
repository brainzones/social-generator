// path: /api/summarizeResearch.ts
import { GoogleGenAI } from "@google/genai";

interface VercelRequest {
    method: string;
    body: {
        research: string; // Plain text
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
        const { research } = req.body;
        if (!research) {
            return res.status(400).json({ message: 'Research text is required.' });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `
            You are an expert in simplifying complex scientific topics for a general audience.
            Take the following research points about a teaching strategy and rewrite them as 2-3 simple, easy-to-understand bullet points.
            The goal is to fit this summary comfortably on a social media slide.

            **Critical Rules:**
            -   Keep the language simple, direct, and jargon-free.
            -   Focus on the core benefit for the teacher or student.
            -   The output must be a single HTML string containing only the <li> elements.
            -   Wrap the most important 1-2 key concepts in each bullet point in <strong></strong> tags.
            -   Do not include the surrounding <ul> or <ol> tags. Do not use markdown.

            **Original Research:**
            ${research}
            
            **Example Output:**
            <li>Pre-committing to choices helps students' brains <strong>follow through automatically</strong>.</li><li>Making a public promise makes students <strong>more likely to stick to it</strong>.</li>
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        const summarizedHtml = response.text;
        if (!summarizedHtml) {
            throw new Error("API returned an empty summary.");
        }
        
        return res.status(200).json({ summarizedHtml });

    } catch (error) {
        console.error("Error in summarizeResearch API:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ message: `Failed to summarize research: ${errorMessage}` });
    }
}
