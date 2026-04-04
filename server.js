import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req,res)=>{
  res.send("Backend running 🚀");
});

// GENERATE ROUTE
app.post("/generate", async (req,res)=>{
  const { prompt } = req.body;

  console.log("Prompt:", prompt);

  // अभी dummy response
  res.json({
    success:true,
    video:"https://www.w3schools.com/html/mov_bbb.mp4"
  });
});

app.listen(3000, ()=>{
  console.log("Server running on port 3000");
});
