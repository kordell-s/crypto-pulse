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