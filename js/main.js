// scripts/main.js
document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("dashboard-table-body");
  
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1"
      );
      const coins = await res.json();
  
      coins.forEach((coin, index) => {
        const row = document.createElement("tr");
  
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>
            <img src="${coin.image}" alt="${coin.name}" width="20" class="me-2">
            ${coin.name} (${coin.symbol.toUpperCase()})
          </td>
          <td>$${coin.current_price.toLocaleString()}</td>
          <td class="${coin.price_change_percentage_24h >= 0 ? 'text-success' : 'text-danger'}">
            ${coin.price_change_percentage_24h.toFixed(2)}%
          </td>
          <td>$${coin.market_cap.toLocaleString()}</td>
        `;
  
        tableBody.appendChild(row);
      });
    } catch (error) {
      tableBody.innerHTML = `<tr><td colspan="5" class="text-danger">Failed to load data.</td></tr>`;
      console.error("Error fetching coin data:", error);
    }
  });
  