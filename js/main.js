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


//Functions to handle Login and signup form
document.addEventListener('DOMContentLoaded', function () {
   
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');



    loginBtn.addEventListener('click', function () {
      signupForm.style.display = 'none';
      loginForm.style.display = 'block';
      loginBtn.classList.add('active');
      loginBtn.classList.remove('btn-outline-primary');
      loginBtn.classList.add('btn-primary');
      signupBtn.classList.remove('active');
      signupBtn.classList.add('btn-outline-primary');
      signupBtn.classList.remove('btn-primary');
  });
  
      

    signupBtn.addEventListener('click', function () {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        signupBtn.classList.add('active');
        signupBtn.classList.remove('btn-outline-primary');
        signupBtn.classList.add('btn-primary');
        loginBtn.classList.remove('active');
        loginBtn.classList.add('btn-outline-primary');
        loginBtn.classList.remove('btn-primary');
    });
  }
  );