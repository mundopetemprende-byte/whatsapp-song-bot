require("dotenv").config();
const axios = require("axios");
const prompt = require("./prompt");

async function askGemini(message){

const response = await axios.post(

`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,

{
contents:[
{
parts:[
{
text: prompt + "\nCliente: " + message
}
]
}
]
}

);

return response.data.candidates[0].content.parts[0].text;

}

module.exports = askGemini;
