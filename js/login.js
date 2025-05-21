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

  //signup form


  document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

   const user = {
    name, email, password, avatarUrl:""};
    localStorage.setItem('user', JSON.stringify(user));

    alert("Signup successful! You can now log in.");
    document.getElementById('signupForm').reset();
    document.getElementById('loginBtn').click();
  });

  //login user

  document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!storedUser || storedUser.email !== email || storedUser.password !== password) {
      alert("Invalid email or password!");
      return;
    }

    localStorage.setItem("loggedIn", true);
    alert("Login successful!");
    window.location.href = "pages/portfolio.html";
  });
