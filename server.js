import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();


const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1", 
  apiKey:process.env.OPEN_ROUTER_API_KEY,
});

// Tools
function getWeatherDetails(city) {
  if (city.toLowerCase() === "patiala") return "10°C";
  if (city.toLowerCase() === "pathankot") return "20°C";
  if (city.toLowerCase() === "rajashtan") return "30°C";
  if (city.toLowerCase() === "shimla") return "5°C";
  if (city.toLowerCase() === "kangra") return "20°C";
}

const user = "Hey what is the weather of pathankot";

client.chat.completions.create({
  model: "google/gemma-4-31b-it:free",   
  messages: [{ role: "user", content: user }],
}).then(e => {
  console.log(e.choices[0].message.content);
});
