const express = require("express");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = 3000;

// Serve static frontend files from /public
app.use(express.static("public"));

// Proxy route to avoid CoinGecko CORS issue
app.get("/api/coins", async (req, res) => {
  const ids = req.query.ids;
  const url = ids
    ? `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`
    : "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";


  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching coins:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/price", async (req, res) => {
  const ids = req.query.ids;
  const vs_currencies = req.query.vs_currencies;

  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${vs_currencies}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching price:", error);
    res.status(500).json({ error: "Failed to fetch price" });
  }
});
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
