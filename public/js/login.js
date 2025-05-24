document.addEventListener('DOMContentLoaded', () => {
  // Check if user is already logged in
  firebase.auth().onAuthStateChanged((user) => {
    const fromLoginOrSignup = sessionStorage.getItem("authJustCompleted") === "true";
  
    console.log("👤 Auth state changed:", user);
    console.log("📦 sessionStorage flag:", fromLoginOrSignup);

  if (user && fromLoginOrSignup) {
    console.log("🚀 Redirecting to coins.html");
    sessionStorage.removeItem("authJustCompleted");
    window.location.href = "/coins.html";
  }
});
  

  // Toggle between login and signup forms
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  loginBtn.addEventListener('click', () => {
      loginBtn.classList.remove('btn-outline-primary');
      loginBtn.classList.add('btn-primary');
      signupBtn.classList.remove('btn-primary');
      signupBtn.classList.add('btn-outline-primary');
      
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
  });

  signupBtn.addEventListener('click', () => {
      signupBtn.classList.remove('btn-outline-primary');
      signupBtn.classList.add('btn-primary');
      loginBtn.classList.remove('btn-primary');
      loginBtn.classList.add('btn-outline-primary');
      
      signupForm.style.display = 'block';
      loginForm.style.display = 'none';
  });

  // Handle login form submission
  document.getElementById('loginFormElement').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const submitBtn = document.getElementById('loginSubmitBtn');
      
      // Show loading state
      showLoading(submitBtn);
      
      try {
          await firebase.auth().signInWithEmailAndPassword(email, password);
          sessionStorage.setItem("authJustCompleted", "true"); 

          // Firebase auth state change will handle redirect
          console.log('Login successful');
          window.location.href = "/coins.html";

      } catch (error) {
          console.error('Login error:', error);
          showAlert('Login failed: ' + error.message, 'danger');
      } finally {
          hideLoading(submitBtn);
      }
  });

  // Handle signup form submission
  document.getElementById('signupFormElement').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('signupName').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const submitBtn = document.getElementById('signupSubmitBtn');
      
      // Validate passwords match
      if (password !== confirmPassword) {
          showAlert('Passwords do not match', 'danger');
          return;
      }
      
      // Show loading state
      showLoading(submitBtn);
      
      try {
          const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
          
          // Update user profile with display name
          await userCredential.user.updateProfile({
              displayName: name
          });
          sessionStorage.setItem("authJustCompleted", "true"); 
          console.log('Signup successful');
          showAlert('Account created successfully!', 'success');
          
          // Firebase auth state change will handle redirect
      } catch (error) {
          console.error('Signup error:', error);
          showAlert('Signup failed: ' + error.message, 'danger');
      } finally {
          hideLoading(submitBtn);
      }
  });
});

function showLoading(button) {
  const text = button.querySelector('.button-text');
  const spinner = button.querySelector('.spinner-border');
  
  text.classList.add('d-none');
  spinner.classList.remove('d-none');
  button.disabled = true;
}

function hideLoading(button) {
  const text = button.querySelector('.button-text');
  const spinner = button.querySelector('.spinner-border');
  
  text.classList.remove('d-none');
  spinner.classList.add('d-none');
  button.disabled = false;
}

function showAlert(message, type) {
  const alertContainer = document.getElementById('alertContainer');
  const alertHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
  `;
  alertContainer.innerHTML = alertHTML;
  
  // Auto-hide success alerts after 3 seconds
  if (type === 'success') {
      setTimeout(() => {
          const alert = alertContainer.querySelector('.alert');
          if (alert) {
              alert.remove();
          }
      }, 3000);
  }
}