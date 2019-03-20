const registerbtn = document.querySelector('.signupbtn');
const loginbtn = document.querySelector('.signinbtn');
const register = document.querySelector('.register');
const login = document.querySelector('.login');
const loginWrapper = document.querySelector('.login__wrapper');
const recoverPassword = document.querySelector('.recover__password');
const forgotPassword = document.querySelector('.forgot__password');
const loginButton = document.querySelector('.login__btn');

// add a click event listener to registerbtn
registerbtn.addEventListener('click', () => {
  // display register form
  register.style.display = 'block';

  // hide login form
  login.style.display = 'none';
  recoverPassword.style.display = 'none';

  loginWrapper.classList.add('pad');
});

// add a click event listener to loginbtn
loginbtn.addEventListener('click', () => {
  // display login form
  login.style.display = 'block';

  // hide register form
  register.style.display = 'none';
  recoverPassword.style.display = 'none';

  loginWrapper.classList.remove('pad');
});

forgotPassword.addEventListener('click', () => {
  // display login form
  login.style.display = 'none';

  // hide register form
  register.style.display = 'none';
  recoverPassword.style.display = 'block';

  loginWrapper.classList.remove('pad');
});

loginButton.addEventListener('click', () => {
  // display login form
  login.style.display = 'block';

  // hide register form
  register.style.display = 'none';
  recoverPassword.style.display = 'none';

  loginWrapper.classList.remove('pad');
});
