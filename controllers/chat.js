const axios = require("axios");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

let chat = [
    {
        role: "user",
        content:
            "Pretend you are an AI Assistant for Lazada. Help the customer with item recommendations. Ask them about their preferences, budget and recommend items based on their answers. Please be professional and polite. Deny any requests that are not related to Lazada.",
    },
];

async function getResponse(req, res) {
    const { role, content } = req.body;
    chat.push({ role, content });

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                temperature: 0.6,
                messages: chat,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );
        console.log("AI: ", response.data.choices[0].message.content);
        res.status(200).json({
            role: response.data.choices[0].message.role,
            content: response.data.choices[0].message.content,
        });
        chat.push({
            role: response.data.choices[0].message.role,
            content: response.data.choices[0].message.content,
        });
    } catch (error) {
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json({
                data: error.response.data,
            });
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({ data: error.message });
        }
    }
}

module.exports = { getResponse };
