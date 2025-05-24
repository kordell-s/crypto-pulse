document.addEventListener('DOMContentLoaded', () => {
    if (typeof firebase === 'undefined') {
      console.error("Firebase not loaded");
      return;
    }
  
    firebase.auth().onAuthStateChanged((user) => {
      console.log("Navbar auth state:", user ? "logged in" : "logged out");
      updateNavbar(user);
    });
  });
  
  function updateNavbar(user) {
    const loginBtns = document.getElementById("login-buttons");
    const userInfo = document.getElementById("user-info");
    const avatarEl = document.getElementById("user-avatar");
    const nameEl = document.getElementById("username-display");
    const watchlistLink = document.getElementById("watchlist-link");
    const portfolioLink = document.getElementById("portfolio-link");
  
    if (user) {
      // Logged in
      loginBtns?.classList.add("d-none");
      userInfo?.classList.remove("d-none");
      userInfo?.classList.add("d-flex");
  
      if (avatarEl) avatarEl.src = user.photoURL || "/assets/img/avatar.jpg";
      if (nameEl) nameEl.textContent = user.displayName || user.email;
  
      watchlistLink?.classList.remove("d-none");
      portfolioLink?.classList.remove("d-none");
    } else {
      // Logged out
      loginBtns?.classList.remove("d-none");
      userInfo?.classList.add("d-none");
      userInfo?.classList.remove("d-flex");
  
      watchlistLink?.classList.add("d-none");
      portfolioLink?.classList.add("d-none");
    }
  }
  
  // Logout function
  function logout() {
    firebase.auth().signOut().then(() => {
      console.log("User signed out");
      window.location.href = "/pages/login.html";
    }).catch((error) => {
      console.error("Sign out error:", error);
    });
  }
  
  window.logout = logout;
  