import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_TOKEN = process.env.API_TOKEN;

app.get("/", (req,res)=>{
  res.send("AI Backend Running 🚀");
});

app.post("/generate", async (req,res)=>{
  const { prompt } = req.body;

  try{

    const response = await fetch("https://api.replicate.com/v1/models/anotherjesse/zeroscope-v2-xl/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: {
          prompt: prompt,
          width: 576,
          height: 320,
          num_frames: 24,
          fps: 8
        }
      })
    });

    const data = await response.json();

    console.log("RESPONSE:", data); // 🔥 debug

    // ❌ अगर error आया तो frontend को भेज
    if(data.error){
      return res.status(400).json({ error: data.error });
    }

    res.json(data);

  }catch(err){
    console.log("SERVER ERROR:", err); // 🔥 debug
    res.status(500).json({ error: err.message });
  }
});

app.get("/status/:id", async (req,res)=>{
  const id = req.params.id;

  try{

    const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: {
        "Authorization": `Token ${API_TOKEN}`
      }
    });

    const data = await response.json();

    console.log("STATUS:", data); // 🔥 debug

    res.json(data);

  }catch(err){
    console.log("STATUS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, ()=>{
  console.log("Server running 🚀");
});
