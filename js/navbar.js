document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  
    const avatarEl = document.getElementById("user-avatar");
    const nameEl = document.getElementById("username-display");
    const userInfo = document.getElementById("user-info");
    const loginBtns = document.getElementById("login-buttons");
  
    if (isLoggedIn && user) {
      if (avatarEl) avatarEl.src = user.avatarUrl || "https://via.placeholder.com/150";
      if (nameEl) nameEl.textContent = user.name;
      if (userInfo) userInfo.style.display = "flex";
      if (loginBtns) loginBtns.style.display = "none";
    } else {
      if (userInfo) userInfo.style.display = "none";
      if (loginBtns) loginBtns.style.display = "flex";
    }
  });