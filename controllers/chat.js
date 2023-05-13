const axios = require("axios");
const date = require("date-and-time");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

let chat = [
  {
    role: "user",
    content:
      "Pretend you are an AI Assistant for Lazada. Help the customer with item recommendations. If they for fashion recommendations, ask them about their preferences which may include item's gender target, size, color, origin, price, style and recommend items based on their answers (DO NOT ask them these questions for food products). Please be professional and polite. If user chooses an item from your recommendation list, give them a list of vendors, both verified (the verified vendors are called 'LazPick') and unverified (please give the vendor name indicate whether are not they are verified). And the list of ratings and price, which may differ for different vendor. Give the user the ability to add to their cart. The user's cart currently has this item: Royal Canin 1.2kg bag Grain cat food for adult cats - MeoShop (LazPick), $29.99, rating 4.2. If the user asks for recommendations from the cart, do not ask any further questions, just answer their question directly. Deny any requests that are not related to Lazada. Split each question into rows",
  },
];

async function getResponse(req, res) {
  const { role, content } = req.body;
  chat.push({ role, content });
  logChat(role, content);

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
    res.status(200).json({
      role: response.data.choices[0].message.role,
      content: response.data.choices[0].message.content,
    });
    chat.push({
      role: response.data.choices[0].message.role,
      content: response.data.choices[0].message.content,
    });
    logChat(
      response.data.choices[0].message.role,
      response.data.choices[0].message.content
    );
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

const logChat = (role, content) => {
  const now = date.format(new Date(), "DD/MM/YYYY HH:mm:ss");
  const log = `[${now}] ${role === "user" ? "USER" : "AI"}: ${content}\n`;
  fs.appendFileSync("chat.log", log, (err) => {
    if (err) throw err;
  });
};

module.exports = { getResponse };
