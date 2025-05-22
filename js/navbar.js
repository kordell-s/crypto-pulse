(() => {
    let user;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch {
      user = null;
    }
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  
    console.log("Login status:", isLoggedIn, "User:", user);
  
    const loginBtns = document.getElementById("login-buttons");
    const userInfo  = document.getElementById("user-info");
    const avatarEl  = document.getElementById("user-avatar");
    const nameEl    = document.getElementById("username-display");
  
    if (isLoggedIn && user) {
      loginBtns?.classList.add("d-none");
      userInfo?.classList.remove("d-none");
      if (avatarEl) avatarEl.src = user.avatarUrl || "/assets/img/avatar.jpg";

    } else {
      loginBtns?.classList.remove("d-none");
      userInfo?.classList.add("d-none");
    }
  
    // Attach logout handler
    document.getElementById("logout-button")?.addEventListener("click", () => {
      localStorage.setItem("loggedIn", "false");
      window.location.href = "/pages/login.html";
    });
  })();
  