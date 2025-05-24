
  // Function to remove coins from portfolio
  function removeFromPortfolio(coinName){
    if (!confirm(`Are you sure you want to remove ${coinName} from your portfolio?`)) {
      return;
    }
    let portfolio = JSON.parse(localStorage.getItem("portfolio")) || [];
    portfolio = portfolio.filter(c => c.name !== coinName);
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
    location.reload();
  }


  document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("portfolio-table-body");
    const totalValueElement = document.getElementById("total-value");
    const portfolio = JSON.parse(localStorage.getItem("portfolio")) || [];
  
    if (!tableBody) return;
  
    if (portfolio.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-center">No coins in portfolio.</td></tr>`;
      totalValueElement.textContent = "$0.00";
      return;
    }
  
    
    const ids = portfolio.map(p => p.id).filter(Boolean).join(",");
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`);
    const livePrices = await res.json();
  
    let portfolioValue = 0;
    let labels = [];
    let data = [];
  
    portfolio.forEach((entry) => {
      const coin = livePrices.find(c => c.id === entry.id);
      if (!coin) return;
  
      const value = entry.quantity * coin.current_price;
      portfolioValue += value;

      const totalInvested = entry.totalInvested ?? (entry.price * entry.quantity);
      const averagePrice = totalInvested / entry.quantity;
      
      const profitLoss = (coin.current_price - averagePrice) * entry.quantity;
      const plColor = profitLoss >= 0 ? 'text-success' : 'text-danger';
  
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${coin.image}" alt="${coin.name}" width="20" class="me-2"></td>
        <td>${coin.name}</td>
        <td>${entry.quantity}</td>
        <td>$${coin.current_price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
        <td>$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
        <td class="${plColor}">$${profitLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>

        <td>
          <button class="btn btn-sm btn-warning" onclick="openSellModal('${coin.id}', ${entry.quantity})">Sell</button>

          <button class="btn btn-sm btn-danger" onclick="removeFromPortfolio('${coin.name}')">Remove</button>
        </td>
      `;
      tableBody.appendChild(row);
  
      labels.push(coin.name);
      data.push(value);
    });
  
    totalValueElement.textContent = `$${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  
    // Draw the chart AFTER data is prepared
    const ctx = document.getElementById('portfolio-chart').getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: "Portfolio Value",
          data: data,
          backgroundColor: [
            '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF6384', '#33FF85'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        animation: {
          animateScale: true,    
          animateRotate: true,    
          duration: 1000,         
          easing: 'easeOutBounce' 
        }
      
      }
    });
  });
  

  //Sell Modal script
  function openSellModal(coinId, maxQuantity) {
    document.getElementById("sellCoinId").value = coinId;
    document.getElementById("sellQuantity").value = "";
    document.getElementById("sellMaxHint").textContent = `Max available: ${maxQuantity}`;
    const modal = new bootstrap.Modal(document.getElementById("sellModal"));
    modal.show();
  }
  
  document.getElementById("sellForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const coinId = document.getElementById("sellCoinId").value;
    const quantityToSell = parseFloat(document.getElementById("sellQuantity").value);
  
    let portfolio = JSON.parse(localStorage.getItem("portfolio")) || [];
    const coin = portfolio.find(c => c.id === coinId);
  
    if (!coin || quantityToSell > coin.quantity) {
      alert("Invalid sale amount.");
      return;
    }
  
    coin.quantity -= quantityToSell;
    if (coin.quantity <= 0) {
      portfolio = portfolio.filter(c => c.id !== coinId);
    }
  
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
    bootstrap.Modal.getInstance(document.getElementById("sellModal")).hide();
    logTransaction("sell", coinId, coin.quantity, coin.price);

    location.reload();
  });
  
  //function to log transactions
  function logTransaction(type, id, quantity, price) {
    const history = JSON.parse(localStorage.getItem("transactions")) || [];
    history.push({
      type,
      id,
      quantity,
      price,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("transactions", JSON.stringify(history));
  }
  


 