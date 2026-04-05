 import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ SAFE (Render Environment Variable)
const API_TOKEN = process.env.API_TOKEN;

// Home route
app.get("/", (req,res)=>{
  res.send("AI Backend Running 🚀");
});

// 🎬 GENERATE VIDEO
app.post("/generate", async (req,res)=>{
  const { prompt } = req.body;

  try{

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // 🔥 REAL TEXT → VIDEO MODEL
        version: "e1c8b5e3a2f9d7c6b4a3f2e1d9c8b7a6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1",
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

    res.json(data);

  }catch(err){
    res.status(500).json({ error: err.message });
  }
});

// 📡 CHECK STATUS
app.get("/status/:id", async (req,res)=>{
  const id = req.params.id;

  try{

    const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: {
        "Authorization": `Token ${API_TOKEN}`
      }
    });

    const data = await response.json();

    res.json(data);

  }catch(err){
    res.status(500).json({ error: err.message });
  }
});

// 🚀 SERVER START
app.listen(3000, ()=>{
  console.log("Server running 🚀");
});
