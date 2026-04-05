import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 ENV TOKEN
const API_TOKEN = process.env.API_TOKEN;

// TEST ROUTE
app.get("/", (req,res)=>{
  res.send("AI Backend Running 🚀");
});

// 🎬 GENERATE
app.post("/generate", async (req,res)=>{
  const { prompt } = req.body;

  try{

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method:"POST",
      headers:{
        "Authorization": `Token ${API_TOKEN}`,
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        version: "db21e45c2fdc7f4a0c0d1d0b7a6b9f3c1a6e4f5b2c3d4e5f6a7b8c9d0e1f2a3",
        input:{ prompt }
      })
    });

    const text = await response.text();
    console.log("RAW RESPONSE:", text);

    let data;
    try{
      data = JSON.parse(text);
    }catch{
      return res.status(500).json({ error: "Invalid JSON", raw: text });
    }

    if(!response.ok){
      return res.status(response.status).json(data);
    }

    if(!data.id){
      return res.status(400).json({ error: "No ID", full: data });
    }

    res.json({ id: data.id });

  }catch(err){
    console.log("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📡 STATUS
app.get("/status/:id", async (req,res)=>{
  const id = req.params.id;

  try{

    const response = await fetch(
      `https://api.replicate.com/v1/predictions/${id}`,
      {
        headers:{
          "Authorization": `Token ${API_TOKEN}`
        }
      }
    );

    const data = await response.json();

    res.json({
      status: data.status,
      output: data.output
    });

  }catch(err){
    res.status(500).json({ error: err.message });
  }
});

// 🚀 PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
  console.log("Server running on port " + PORT + " 🚀");
});
