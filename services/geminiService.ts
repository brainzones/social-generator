/**
 * A simple utility to strip HTML tags from a string to get clean text.
 * @param htmlString The HTML string to clean.
 * @returns Plain text.
 */
const cleanHtml = (htmlString: string): string => {
    if (typeof window === 'undefined') {
        // Basic stripping for server-side if DOMParser is not available
        return htmlString.replace(/<[^>]*>?/gm, ' ');
    }
    const doc = new window.DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || "";
};

/**
 * Calls our backend API to generate research points based on a teaching strategy.
 * @param title The title of the strategy.
 * @param howTo The HTML content of the "How-To" steps.
 * @returns A promise that resolves to an HTML string of <li> elements.
 */
export const generateResearchPoints = async (title: string, howTo: string): Promise<string> => {
    const response = await fetch('/api/generateResearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, howTo: cleanHtml(howTo) }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate research points from the API.');
    }
    const { researchHtml } = await response.json();
    return researchHtml;
};

/**
 * Calls our backend API to generate a short, engaging hook for a social media story.
 * @param title The title of the strategy.
 * @param howTo The HTML content of the "How-To" steps.
 * @returns A promise that resolves to a single sentence string.
 */
export const generateStoryHook = async (title: string, howTo: string): Promise<string> => {
    const response = await fetch('/api/generateStoryHook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, howTo: cleanHtml(howTo) }),
    });
     if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate story hook from the API.');
    }
    const { hook } = await response.json();
    return hook;
};

/**
 * Calls our backend API to summarize research points for a social media audience.
 * @param researchHtml The HTML string of the research bullet points.
 * @returns A promise that resolves to a simplified HTML string of <li> elements.
 */
export const summarizeResearch = async (researchHtml: string): Promise<string> => {
     const response = await fetch('/api/summarizeResearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ research: cleanHtml(researchHtml) }),
    });
     if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to summarize research from the API.');
    }
    const { summarizedHtml } = await response.json();
    return summarizedHtml;
};

/**
 * Calls our backend API to generate a single-sentence summary for a teaching strategy.
 * @param title The title of the strategy.
 * @returns A promise that resolves to a single sentence string.
 */
export const generateStrategySummary = async (title: string): Promise<string> => {
    const response = await fetch('/api/generateStrategySummary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
    });
     if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate summary from the API.');
    }
    const { summary } = await response.json();
    return summary;
};
