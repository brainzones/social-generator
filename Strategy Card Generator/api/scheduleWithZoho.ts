// This file should be placed in the `api` directory at the root of your project.
// Vercel will automatically detect it as a serverless function.
// e.g., /api/scheduleWithZoho.ts

// This is a generic type for the request from the Vercel serverless function environment.
// We are not using the full `@vercel/node` package to keep dependencies minimal.
interface VercelRequest {
    method: string;
    body: {
        caption: string;
        images: string[]; // Array of base64 data URLs
    };
    // Add other properties as needed, e.g., headers, query
}

interface VercelResponse {
    status: (statusCode: number) => VercelResponse;
    json: (body: any) => void;
    // Add other methods as needed, e.g., send, end
}


export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_BRAND_ID } = process.env;

    if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN || !ZOHO_BRAND_ID) {
        return res.status(500).json({ message: 'Zoho API credentials are not configured on the server.' });
    }

    const { caption, images } = req.body;

    if (!caption || !images || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ message: 'Caption and images are required.' });
    }

    try {
        // Step 1: Get a fresh access token from Zoho
        const tokenResponse = await fetch('https://accounts.zoho.com/oauth/v2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                refresh_token: ZOHO_REFRESH_TOKEN,
                client_id: ZOHO_CLIENT_ID,
                client_secret: ZOHO_CLIENT_SECRET,
                grant_type: 'refresh_token',
            }),
        });

        const tokenData = await tokenResponse.json();
        if (!tokenResponse.ok || !tokenData.access_token) {
            console.error('Zoho Token Error:', tokenData);
            throw new Error('Could not authenticate with Zoho. Check your credentials.');
        }
        const { access_token } = tokenData;

        // Step 2: Upload each image and collect the media_ids
        const media_ids: string[] = [];
        for (const [index, imageDataUrl] of images.entries()) {
            const base64Data = imageDataUrl.split(',')[1];
            const imageBuffer = Buffer.from(base64Data, 'base64');
            
            const formData = new FormData();
            // Use Blob to correctly form the multipart request
            formData.append('media', new Blob([imageBuffer]), `slide-${index + 1}.png`);
            
            const uploadResponse = await fetch('https://www.zohoapis.com/social/v1/media', {
                method: 'POST',
                headers: { 'Authorization': `Zoho-oauthtoken ${access_token}` },
                body: formData,
            });

            const uploadResult = await uploadResponse.json();
             if (!uploadResponse.ok || !uploadResult?.data?.media_id) {
                console.error('Zoho Media Upload Error:', uploadResult);
                throw new Error(`Failed to upload image #${index + 1} to Zoho Social.`);
            }
            media_ids.push(uploadResult.data.media_id);
        }

        // Step 3: Create the social media post
        const postPayload = {
            message: caption,
            media_ids: media_ids,
        };

        const postResponse = await fetch(`https://www.zohoapis.com/social/v1/brands/${ZOHO_BRAND_ID}/posts`, {
            method: 'POST',
            headers: {
                'Authorization': `Zoho-oauthtoken ${access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postPayload),
        });
        
        const postResult = await postResponse.json();
        if (!postResponse.ok) {
            console.error('Zoho Post Creation Error:', postResult);
            throw new Error(postResult.message || 'Failed to create post in Zoho Social.');
        }

        // Step 4: Return success response to the frontend
        return res.status(200).json({ message: 'Post successfully scheduled to Zoho Social!' });

    } catch (error) {
        console.error('Full scheduling error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
        return res.status(500).json({ message: errorMessage });
    }
}
