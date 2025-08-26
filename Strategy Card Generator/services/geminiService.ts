import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

/**
 * A simple utility to strip HTML tags from a string to get clean text.
 * @param htmlString The HTML string to clean.
 * @returns Plain text.
 */
const cleanHtml = (htmlString: string): string => {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || "";
};

/**
 * Calls the Gemini API to generate research points based on a teaching strategy.
 * @param title The title of the strategy.
 * @param howTo The HTML content of the "How-To" steps.
 * @returns A promise that resolves to an HTML string of <li> elements.
 */
export const generateResearchPoints = async (title: string, howTo: string): Promise<string> => {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set.");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const cleanHowTo = cleanHtml(howTo);

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
            ${cleanHowTo}

            **Example Output:**
            <li>Commitment bias signing ahead leverages <strong>consistency drives</strong>, reducing pushback.</li><li>Executive control pre-commitment recruits <strong>prefrontal circuits</strong> for automatic follow-through.</li>
        `;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const researchHtml = response.text;

        if (!researchHtml) {
            throw new Error("API returned an empty response.");
        }
        
        // Basic validation to ensure we got something that looks like list items
        if (!researchHtml.includes('<li>') || !researchHtml.includes('</li>')) {
             console.warn("Gemini response may not be correctly formatted. Wrapping the response in a list item.");
             return `<li>${researchHtml}</li>`;
        }

        return researchHtml;
    } catch (error) {
        console.error("Error generating research points:", error);
        if (error instanceof Error && error.message.includes('API key not valid')) {
             throw new Error("Your API key is not valid. Please check your configuration.");
        }
        throw new Error("Failed to generate research points from AI. Please try again.");
    }
};


/**
 * Calls the Gemini API to generate a short, engaging hook for a social media story.
 * @param title The title of the strategy.
 * @param howTo The HTML content of the "How-To" steps.
 * @returns A promise that resolves to a single sentence string.
 */
export const generateStoryHook = async (title: string, howTo: string): Promise<string> => {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set.");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const cleanHowTo = cleanHtml(howTo);

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
            ${cleanHowTo}

            **Example of a great, specific hook (for a different strategy):**
            This simple classroom pact can help you sidestep power struggles before they even begin.
        `;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.9,
                thinkingConfig: { thinkingBudget: 0 } 
            }
        });

        const hook = response.text;

        if (!hook) {
            throw new Error("API returned an empty response for the story hook.");
        }

        // Trim whitespace and remove surrounding quotes if they exist
        return hook.trim().replace(/^"|"$/g, '');
    } catch (error) {
        console.error("Error generating story hook:", error);
        if (error instanceof Error && error.message.includes('API key not valid')) {
             throw new Error("Your API key is not valid. Please check your configuration.");
        }
        throw new Error("Failed to generate story hook from AI. Please try again.");
    }
};


/**
 * Summarizes research points into simpler, layman's terms for a social media audience.
 * @param researchHtml The HTML string of the research bullet points.
 * @returns A promise that resolves to a simplified HTML string of <li> elements.
 */
export const summarizeResearch = async (researchHtml: string): Promise<string> => {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set.");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const cleanResearch = cleanHtml(researchHtml);

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
            ${cleanResearch}
            
            **Example Output:**
            <li>Pre-committing to choices helps students' brains <strong>follow through automatically</strong>.</li><li>Making a public promise makes students <strong>more likely to stick to it</strong>.</li>
        `;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        const summarizedHtml = response.text;
        if (!summarizedHtml) {
            throw new Error("API returned an empty summary.");
        }
        return summarizedHtml;

    } catch (error) {
        console.error("Error summarizing research:", error);
        if (error instanceof Error && error.message.includes('API key not valid')) {
             throw new Error("Your API key is not valid. Please check your configuration.");
        }
        throw new Error("Failed to summarize research from AI. Please try again.");
    }
};

/**
 * Generates a single-sentence summary for a teaching strategy.
 * @param title The title of the strategy.
 * @returns A promise that resolves to a single sentence string.
 */
export const generateStrategySummary = async (title: string): Promise<string> => {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set.");
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

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { temperature: 0.8 }
        });

        const summary = response.text;
        if (!summary) {
            throw new Error("API returned an empty summary.");
        }
        return summary.trim().replace(/^"|"$/g, '');

    } catch (error) {
        console.error("Error generating strategy summary:", error);
        if (error instanceof Error && error.message.includes('API key not valid')) {
             throw new Error("Your API key is not valid. Please check your configuration.");
        }
        throw new Error("Failed to generate summary from AI. Please try again.");
    }
};
