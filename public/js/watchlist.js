function removeFromWatchList(coinId){
    let list = JSON.parse(localStorage.getItem("watchlist")) || [];
    list = list.filter(c => c.id !== coinId);
    localStorage.setItem("watchlist", JSON.stringify(list));
    location.reload();
}

async function renderWatchlist() {
    const tableBody = document.getElementById("watchlist-table-body");
    if (!tableBody) {
      console.error("❌ #watchlist-table-body not found");
      return;
    }
  
    const list = JSON.parse(localStorage.getItem("watchlist")) || [];
  
    if (list.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center">No coins in watchlist.</td></tr>`;
      return;
    }
  
    // Extract valid CoinGecko IDs
    const ids = list.map(c => c.id).filter(Boolean).join(",");
  
    try {
      const res = await fetch(`/api/coins?ids=${ids}`);;
      const coinsWithPrices = await res.json();
  
      // Ensure API returned an array
      if (!Array.isArray(coinsWithPrices)) {
        console.error("🚨 API returned error:", coinsWithPrices);
        tableBody.innerHTML = `<tr><td colspan="5" class="text-danger text-center">Failed to load coin data.</td></tr>`;
        return;
      }
  
      // Clear table before populating
      tableBody.innerHTML = "";
  
      coinsWithPrices.forEach((coin, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>
            <img src="${coin.image}" alt="${coin.name}" width="20" class="me-2">
            ${coin.name} (${coin.symbol.toUpperCase()})
          </td>
          <td>$${coin.current_price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
          <td>
            <button class="btn btn-sm btn-success" data-id="${coin.id}" data-name="${coin.name}" data-symbol="${coin.symbol}" onclick="openBuyModal(this)">Buy</button>
            <button class="btn btn-sm btn-danger" onclick="removeFromWatchList('${coin.id}')">Remove</button>          </td>
        `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error("❌ Failed to fetch watchlist prices:", error);
      tableBody.innerHTML = `<tr><td colspan="5" class="text-danger text-center">Error loading watchlist data.</td></tr>`;
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    renderWatchlist()
});

//Buy Modal script

function openBuyModal(button) {
    const id = button.dataset.id;
    const name = button.dataset.name;
  
    document.getElementById("buyCoinId").value = id;
    document.getElementById("buyCoinName").value = name;
    document.getElementById("buyQuantity").value = "";
  
    const modal = new bootstrap.Modal(document.getElementById("buyModal"));
    modal.show();
  }
  
  document.getElementById("buyForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const coinId = document.getElementById("buyCoinId").value;
    const quantity = parseFloat(document.getElementById("buyQuantity").value);
  
    const res = await fetch(`/api/price?ids=${coinId}&vs_currencies=usd`);

    const data = await res.json();
    const price = data[coinId]?.usd;
  
    if (!price) {
      alert("Failed to fetch price.");
      return;
    }
  
    saveToPortfolio(coinId, price, quantity);
    alert(`Purchased ${quantity} shares of ${coinId.toUpperCase()} at $${price}`);
    bootstrap.Modal.getInstance(document.getElementById("buyModal")).hide();
  });
  
  

   //Function to store coins to portfolio in local storage
 function saveToPortfolio(coinId, price, quantity) {
    const portfolio = JSON.parse(localStorage.getItem("portfolio")) || [];

    const existing = portfolio.find(c => c.id == coinId);

 if (existing){
  existing.totalInvested += price * quantity;
 existing.quantity += quantity;
 existing.price = price;
 }else{
  portfolio.push({id: coinId, price, quantity, totalInvested: price * quantity});

 }

 localStorage.setItem("portfolio", JSON.stringify(portfolio))
  
}

  //goto portfolio

  function goToPortfolio() {
    const modal = bootstrap.Modal.getInstance(document.getElementById("buyModal"));
    modal.hide();

    window.location.href = "/pages/portfolio.html";
  }