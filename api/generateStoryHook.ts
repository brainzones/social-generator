// path: /api/generateStoryHook.ts
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
            You are a social media expert creating content for teachers. 
            Your goal is to write a short, compelling "hook" for an Instagram Story about the following teaching strategy.

            **Your Task:**
            1.  Analyze the provided strategy's title and description.
            2.  Identify the core problem it solves or the unique benefit it offers to a teacher.
            3.  Write a SINGLE, concise, and intriguing sentence that captures this specific benefit.

            **Critical Rules:**
            -   **BE SPECIFIC:** Do not use generic phrases that could apply to any strategy (e.g., "improve your classroom," "engage students"). Focus on what makes THIS strategy special.
            -   **FOCUS ON THE WHY:** The hook should explain WHY a teacher should care. Do not explain the "how-to."
            -   **TONE:** Intriguing and professional.
            -   **FORMAT:** Output only the single sentence. No extra formatting, no quotation marks.

            **Strategy Title:**
            ${title}

            **Strategy Description:**
            ${howTo}

            **Example of a great, specific hook (for a different strategy):**
            This simple classroom pact can help you sidestep power struggles before they even begin.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.9,
                thinkingConfig: { thinkingBudget: 0 } 
            }
        });

        const hookText = response.text;
        if (!hookText) {
            throw new Error("API returned an empty response for the story hook.");
        }

        const hook = hookText.trim().replace(/^"|"$/g, '');
        return res.status(200).json({ hook });

    } catch (error) {
        console.error("Error in generateStoryHook API:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ message: `Failed to generate story hook: ${errorMessage}` });
    }
}
