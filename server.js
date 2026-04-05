import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ ENV VARIABLE (SAFE)
const API_TOKEN = process.env.API_TOKEN;

// Home route
app.get("/", (req,res)=>{
  res.send("AI Backend Running 🚀");
});

// STEP 1: Create Prediction
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
        version: "db21e45b6f0b4b7a6d7b7a3f8f3b2c8e2e1c4c7a7e9b8c6d5e4f3a2b1c0d9e8",
        input: { prompt }
      })
    });

    const data = await response.json();

    res.json(data);

  }catch(err){
    res.status(500).json({ error: err.message });
  }
});

// STEP 2: Check Status
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

app.listen(3000, ()=>{
  console.log("Server running 🚀");
});
