app.post("/generate", async (req,res)=>{
  const { prompt } = req.body;

  try{

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method:"POST",
      headers:{
        "Authorization": `Token ${process.env.API_TOKEN}`,
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        version: "db21e45c2fdc7f4a0c0d1d0b7a6b9f3c1a6e4f5b2c3d4e5f6a7b8c9d0e1f2a3",
        input:{
          prompt: prompt
        }
      })
    });

    // 🔥 IMPORTANT
    const text = await response.text();
    console.log("RAW RESPONSE:", text);

    let data;
    try{
      data = JSON.parse(text);
    }catch{
      return res.status(500).json({ error: "Invalid JSON from API", raw: text });
    }

    if(!response.ok){
      return res.status(response.status).json(data);
    }

    if(!data.id){
      return res.status(400).json({ error: "No ID received", full: data });
    }

    res.json({ id: data.id });

  }catch(err){
    console.log("SERVER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
