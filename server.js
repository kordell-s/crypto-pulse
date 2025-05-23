// server.js
const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = 3000;

const API_KEY = "89b9dbdb8f55ab23fdf69babfecd86b1bfdabba1";

app.use(express.static("public"));

app.get("/api/news", async (req, res) => {
  try {
    const response = await fetch(`https://cryptopanic.com/api/v1/posts/?auth_token=${API_KEY}&public=true`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
