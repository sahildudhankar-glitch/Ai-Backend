import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_TOKEN = process.env.API_TOKEN;

// Home route
app.get("/", (req, res) => {
  res.send("AI Backend Running 🚀");
});

// 🎬 GENERATE VIDEO (FIXED)
app.post("/generate", async (req,res)=>{
  const { prompt } = req.body;

  try{

    const response = await fetch(
      "https://api.replicate.com/v1/predictions",
      {
        method:"POST",
        headers:{
          "Authorization": `Token ${API_TOKEN}`,
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          version: "9d9e3f2c2a9c0c5b6e4a4c5d7c6a3b2f8e5d4c3b2a1f0e9d8c7b6a5e4d3c2b1",
          input:{
            prompt: prompt
          }
        })
      }
    );

    const data = await response.json();

    console.log("GENERATE RESPONSE:", data);

    if(data.error){
      return res.status(400).json({ error: data.error });
    }

    res.json({ id: data.id });

  }catch(err){
    console.log("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📡 CHECK STATUS
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

    console.log("STATUS RESPONSE:", data);

    res.json({
      status: data.status,
      output: data.output
    });

  }catch(err){
    console.log("STATUS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ PORT FIX
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
  console.log("Server running on port " + PORT + " 🚀");
});
