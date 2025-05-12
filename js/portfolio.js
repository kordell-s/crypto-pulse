 //Function to store coins to portfolio in local storage
 function saveToPortfolio(coin) {
    let portfolio = JSON.parse(localStorage.getItem("portfolio")) || [];
    if (!portfolio.includes(coin)) {
    portfolio.push(coin);
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
  }
}
  // Function to remove coins from portfolio
  function removeFromPortfolio(coin){
    let portfolio = JSON.parse(localStorage.getItem("portfolio")) || [];
    portfolio = portfolio.filter(item => item !== coin);
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
    location.reload();
  }


  document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("portfolio-table-body");
    const savedCoins = JSON.parse(localStorage.getItem("portfolio")) || [];

    if (!tableBody) return;

    if (savedCoins.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center">No coins in portfolio</td></tr>`;
      return;
    }

   savedCoins.forEach((coin, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${index + 1}</td>
      <td>${coin}</td>
      
      <td>
        <button class="btn btn-sm btn-danger" onclick="removeFromPortfolio('${coin}')">Remove</button>
      </td>
    `;
    tableBody.appendChild(row);

    });
  });