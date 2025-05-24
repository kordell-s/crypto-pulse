document.addEventListener('DOMContentLoaded', () => {
  if (typeof firebase === 'undefined') {
    console.error('Firebase not loaded');
    return;
  }

  firebase.auth().onAuthStateChanged(async (user) => {
    console.log("Auth state confirmed in main.js:", user ? "logged in" : "logged out");

    // Load data for everyone, even guests (optional)
    await populateTable("dashboard-table-body");
    await populateExtendedTable("coin-page-body");

    // If not logged in, block saving to watchlist
    if (!user) {
      document.querySelectorAll(".add-btn, .add-to-watchlist").forEach(button => {
        button.addEventListener("click", () => {
          alert("Please log in to add coins to your watchlist.");
          window.location.href = "/login.html";
        });
      });
    }
  });

  displayPopularCoins(); // okay to call outside auth check
});

//API scripts

  const populateTable = async (tableId) => {
    const tableBody = document.getElementById(tableId);
    if (!tableBody) return; 
    
    try {
      const res = await fetch("/api/coins");
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

  


  
  // Function to load more coins for the coin page
  const populateExtendedTable = async (tableId, count = 20) => {
    const tableBody = document.getElementById(tableId);
    if (!tableBody) return;
    
    try {
      const res = await fetch("/api/coins");
      const coins = await res.json();
  
      if (!Array.isArray(coins)) {
        console.error("⚠️ Expected an array but got:", coins);
        tableBody.innerHTML = `<tr><td colspan="6" class="text-danger">Error loading coins</td></tr>`;
        return;
      }
  
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
           <td> 
          <button class="btn btn-success add-btn" id="add-btn-${coin.id}">
          <i class="bi bi-plus-circle"></i> Add
          </button>
          </td>
        `;

        const addButton = row.querySelector(".add-btn");
        const icon = addButton.querySelector("i");
        addButton.addEventListener("click", function() {
          saveToWatchList({
            id: coin.id,
            name: coin.name,
            image: coin.image,
            current_price: coin.current_price,
          });

          icon.classList.remove("bi-plus-circle");
          icon.classList.add("bi-check-circle", "text-white");

          //animation
          
          setTimeout(() => {
            icon.classList.remove("bi-check-circle");
            icon.classList.add("bi-plus-circle");
          }, 1500);
        
      
          
         
        });
        tableBody.appendChild(row);
      });
    } catch (error) {
      if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-danger">Failed to load data.</td></tr>`;
      }
      console.error("Error fetching extended coin data:", error);
    }
  };
  
   // Function to save coins to watchlist
   function saveToWatchList(coin) {
    const user = firebase.auth().currentUser;
  
    if (!user) {
      alert("Please log in to add coins to your watchlist.");
      window.location.href = "login.html";
      return;
    }
  
    const list = JSON.parse(localStorage.getItem("watchlist")) || [];
    if (!list.find(c => c.id === coin.id)) {
      list.push(coin);
      localStorage.setItem("watchlist", JSON.stringify(list));
    } else {
      alert(`${coin.name} is already in your watchlist.`);
    }
  }
  
  

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



  //Popular Coin Cards carousel
    async function displayPopularCoins() {
      try {
        const res =  await fetch("/api/coins");        
        const coins = await res.json();
        
        const popularCoinsContainer = document.getElementById('popular-coins-cards');
        if (!popularCoinsContainer) return;
        
        // Create carousel structure
        popularCoinsContainer.innerHTML = `
          <div id="coinCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#coinCarousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#coinCarousel" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        `;
        
        const carouselInner = popularCoinsContainer.querySelector('.carousel-inner');
        
        // Create slides - 4 coins per slide
        for (let i = 0; i < coins.length; i += 4) {
          const slideCoins = coins.slice(i, i + 4);
          const isActive = i === 0 ? 'active' : '';
          
          let slideHTML = `<div class="carousel-item ${isActive}"><div class="row">`;
          
          slideCoins.forEach(coin => {
            const priceChangeClass = coin.price_change_percentage_24h >= 0 ? 'text-success' : 'text-danger';
            const priceChangeIcon = coin.price_change_percentage_24h >= 0 ? 'bi-arrow-up' : 'bi-arrow-down';
            
            slideHTML += `
              <div class="col-md-3 mb-4">
                <div class="card h-100 shadow-sm">
                  <div class="card-body text-center">
                    <img src="${coin.image}" alt="${coin.name}" class="coin-image mb-3" style="width: 64px; height: 64px;">
                    <h5 class="card-title">${coin.name} (${coin.symbol.toUpperCase()})</h5>
                    <p class="card-text fw-bold">$${coin.current_price.toLocaleString()}</p>
                    <p class="card-text ${priceChangeClass}">
                      <i class="bi ${priceChangeIcon}"></i>
                      ${Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </p>
                    <button class="btn btn-primary btn-sm add-to-watchlist" data-coin-id="${coin.id}">
                      Add to Watchlist
                    </button>
                  </div>
                </div>
              </div>
            `;
          });
          
          slideHTML += `</div></div>`;
          carouselInner.innerHTML += slideHTML;
        }
        
        // Add event listeners to the watchlist buttons
        document.querySelectorAll('.add-to-watchlist').forEach(button => {
          button.addEventListener('click', function() {
            saveToWatchList(coins.find(coin => coin.id === this.getAttribute('data-coin-id')));
            
            // Show feedback
            const oldText = this.innerHTML;
            this.innerHTML = '<i class="bi bi-check"></i> Added';
            this.classList.remove('btn-primary');
            this.classList.add('btn-success');
            
            setTimeout(() => {
              this.innerHTML = oldText;
              this.classList.remove('btn-success');
              this.classList.add('btn-primary');
            }, 1500);
          });
        });

        // Initialize the carousel with automatic sliding
        new bootstrap.Carousel(document.getElementById('coinCarousel'), {
          interval: 3000,
          wrap: true
        });
        
      } catch (error) {
        console.error('Error fetching popular coins:', error);
      }
    }
