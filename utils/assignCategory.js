import fetch from "node-fetch";

import { openAIKey } from "../config/keys.js";

async function assignCategory(name, description) {
    const prompt = `Based on the following title and description, assign one of the following categories, (NOTE: if nonne of the categories match, assign the category: None) :\n\n` +
                   `Categories: Music, Buisness, Sports, Arts, Food, Education, Kids, ` +
                   `Technology, Health, Fashion, Film, Nightlife, Literature, Travel, Nature, Charity, ` +
                   `Wellness, Culture\n\n` +
                   `Title: ${name}\n` +
                   `Description: ${description}\n` +
                   `Category:`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${openAIKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 20, // Limit the response to one category
        })
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    const category = data.choices[0].message.content.trim();
    return category;
}

export default assignCategory;