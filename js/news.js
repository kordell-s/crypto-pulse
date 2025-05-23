document.addEventListener("DOMContentLoaded", async () => {
    const newsFeed = document.getElementById("news-feed");
  
    try {
      const res = await fetch("https://min-api.cryptocompare.com/data/v2/news/?lang=EN");
      const data = await res.json();
      const top10 = data.Data.slice(0, 12);
  
      top10.forEach((article) => {
        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4 mb-3";
  
        const card = document.createElement("div");
        card.className = "card h-100 shadow-sm";
  
        card.innerHTML = `
          <img src="${article.imageurl || 'https://via.placeholder.com/300x150'}" class="card-img-top" alt="News Image">
          <div class="card-body">
            <h5 class="card-title">${article.title}</h5>
            <p class="card-text small text-muted">${new Date(article.published_on * 1000).toLocaleString()}</p>
            <p class="card-text">${article.body.slice(0, 80)}...</p>
            <a href="${article.url}" target="_blank" class="btn btn-sm btn-outline-primary">Read more</a>
          </div>
        `;
  
        col.appendChild(card);
        newsFeed.appendChild(col);
      });
    } catch (err) {
      console.error("Failed to fetch news:", err);
      newsFeed.innerHTML = `<p class="text-danger text-center">Unable to load news feed. Please try again later.</p>`;
    }
  });
  