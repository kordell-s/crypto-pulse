
  // Function to remove coins from portfolio
  function removeFromPortfolio(coinName){
    let portfolio = JSON.parse(localStorage.getItem("portfolio")) || [];
    portfolio = portfolio.filter(c => c.name !== coinName);
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
    location.reload();
  }


  document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("portfolio-table-body");
    const totalValueElement = document.getElementById("total-value");
    const portfolio = JSON.parse(localStorage.getItem("portfolio")) || [];
    if (!tableBody) return;

    if (portfolio.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center">No coins in portfolio</td></tr>`;
      return;
    }

    let portfolioValue = 0;
    portfolio.forEach((coin) => {
     const totalValue = coin.price * coin.amount;
     portfolioValue += totalValue;

  
      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${coin.image}</td>
      <td>${coin.name}</td>
      <td>${coin.amount}</td>
      <td>$${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
      <td>$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="removeFromPortfolio('${coin.name}')">Remove</button>
      </td>
      `;
      
      tableBody.appendChild(row);
    });
    totalValueElement.textContent = `$${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
      

  });