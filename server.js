require("dotenv").config();
const express = require("express");

const sendMessage = require("./whatsapp");
const askGemini = require("./gemini");
const {getUser,setState} = require("./users");

const app = express();

app.use(express.json());

app.get("/webhook",(req,res)=>{

const mode = req.query["hub.mode"];
const token = req.query["hub.verify_token"];
const challenge = req.query["hub.challenge"];

if(mode === "subscribe" && token === process.env.VERIFY_TOKEN){
return res.status(200).send(challenge);
}

res.sendStatus(403);

});

app.post("/webhook", async (req,res)=>{

try{

const message =
req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

if(!message){
return res.sendStatus(200);
}

const phone = message.from;

const text = message.text?.body || "";

const user = getUser(phone);

if(user.state === "pagado"){
return res.sendStatus(200);
}

if(text.toLowerCase().includes("pagu")){

setState(phone,"pagado");

await sendMessage(
phone,
"¡Perfecto! 🙌 Pago recibido. En breve empezamos tu canción 🎵"
);

return res.sendStatus(200);

}

const reply = await askGemini(text);

await sendMessage(phone,reply);

}catch(error){

console.log(error);

}

res.sendStatus(200);

});

app.listen(process.env.PORT,()=>{

console.log("Servidor iniciado");

});
