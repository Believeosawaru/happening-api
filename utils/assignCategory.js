import fetch from "node-fetch";
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function assignCategory(name, description) {
    const prompt = `Based on the following title and description, assign one of the following categories:\n\n` +
                   `Categories: Music, Buisness, Sports, Arts, Food, Education, Kids, ` +
                   `Technology, Health, Fashion, Film, Nightlife, Literature, Travel, Nature, Charity, ` +
                   `Wellness, Culture\n\n` +
                   `Title: ${name}\n` +
                   `Description: ${description}\n` +
                   `Category:`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
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