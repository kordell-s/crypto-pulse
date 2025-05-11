// scripts/main.js

//API scripts
document.addEventListener("DOMContentLoaded", async () => {
  const populateTable = async (tableId) => {
    const tableBody = document.getElementById(tableId);
    if (!tableBody) return; 
    
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
      if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-danger">Failed to load data.</td></tr>`;
      }
      console.error("Error fetching coin data:", error);
    }
  };

  
  await populateTable("dashboard-table-body");
  
  // Function to load more coins for the coin page
  const populateExtendedTable = async (tableId, count = 50) => {
    const tableBody = document.getElementById(tableId);
    if (!tableBody) return;
    
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${count}&page=1`
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
           <td> <button class="add-btn" data-coin="${coin.name}">
            <i class="bi bi-plus-circle"></i> Add
          </button>
          </td>
        `;

        tableBody.appendChild(row);
      });
    } catch (error) {
      if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-danger">Failed to load data. API rate limit may be exceeded.</td></tr>`;
      }
      console.error("Error fetching extended coin data:", error);
    }
  };
  await populateExtendedTable("coin-page-body");
});
  

//Search functionality

const searchInput = document.getElementById("search-input");


function filterTable() {
  let seachTerm = searchInput.value.toLowerCase();
  let table = document.getElementById("coin-page-body");
  let rows = table.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    let cells = rows[i].getElementsByTagName("td");
    let found = false;
    for (let j = 0; j < cells.length; j++) {
      if (cells[j]) {
        let cellValue = cells[j].textContent || cells[j].innerText;
        if (cellValue.toLowerCase().indexOf(seachTerm) > -1) {
          found = true;
          break;
        }
      }
    }
    rows[i].style.display = found ? "" : "none";
  }
}
if (searchInput) {
  searchInput.addEventListener("keyup", filterTable);
}



  //Function to store coins to portfolio in local storage
  function saveToPortfolio(coin) {
    let portfolio = JSON.parse(localStorage.getItem("portfolio")) || [];
    portfolio.push(coin);
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
  }
  // Function to remove coins from portfolio
  function removeFromPortfolio(coin){
    let portfolio = JSON.parse(localStorage.getItem("portfolio")) || [];
    portfolio = portfolio.filter(item => item !== coin);
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
  }

  //Event listener for add button
  const addButtons = document.querySelectorAll(".add-btn");

  addButtons.forEach(button => {
    button.addEventListener("click", function() {
      const coinName = this.getAttribute("data-coin");
      saveToPortfolio(coinName);
      alert(`${coinName} has been added to your portfolio!`);
    });
  });



  //html template scripts

  function loadComponent(id, file){
    fetch(file)
      .then(response => response.text())
      .then(data => {
        document.getElementById(id).innerHTML = data;
      })
      .catch(error => console.error('Error loading component:', error));
  }

  document.addEventListener("DOMContentLoaded", function() {
    loadComponent("navbar-container", "/components/navbar.html");
    loadComponent("footer-container", "/components/footer.html");
  });