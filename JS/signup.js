const registerbtn = document.querySelector(".signupbtn");
const loginbtn = document.querySelector(".signinbtn");
const register = document.querySelector(".register");
const login = document.querySelector(".login");
const login_wrapper = document.querySelector(".login__wrapper");

//add a click event listener to registerbtn
registerbtn.addEventListener("click", () => {
  //display register form
  register.style.display = "block";

  //hide login form
  login.style.display = "none";

  login_wrapper.classList.add("pad");
});

//add a click event listener to loginbtn
loginbtn.addEventListener("click", () => {
  //display login form
  login.style.display = "block";

  //hide register form
  register.style.display = "none";

  login_wrapper.classList.remove("pad");
});
