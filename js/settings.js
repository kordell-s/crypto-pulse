document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("settings-form");
    const usernameInput = document.getElementById("username");
    const avatarInput = document.getElementById("avatarUrl");
    const avatarPreview = document.getElementById("avatarPreview");
  
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (!user) {
      alert("No user found. Please log in.");
      window.location.href = "/pages/login.html";
      return;
    }
  
    // Pre-fill form with existing data
    usernameInput.value = user.name || "";
    avatarInput.value = user.avatarUrl || "";
    avatarPreview.src = user.avatarUrl || "https://via.placeholder.com/150";
  
    avatarInput.addEventListener("input", () => {
      avatarPreview.src = avatarInput.value || "https://via.placeholder.com/150";
    });
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const updatedUser = {
        ...user,
        name: usernameInput.value,
        avatarUrl: avatarInput.value
      };
  
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Profile updated successfully!");
      window.location.reload();
    });
  });
  