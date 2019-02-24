const bars = document.querySelector(".bars");
const navbar = document.querySelector(".nav");
const messageBody = document.querySelector(".main__body");
const composeMessage = document.querySelector(".compose__message_btn");
const overlay = document.querySelector(".overlay");
const clearOverlay = document.querySelector(".clear__overlay");

bars.addEventListener("click", () => {
  navbar.classList.toggle("nav");
  navbar.classList.toggle("visible1");

  messageBody.classList.toggle("main__body");
  messageBody.classList.toggle("visible");
});

composeMessage.addEventListener("click", () => {
  overlay.style.display = "block";
});

clearOverlay.addEventListener("click", () => {
  overlay.style.display = "none";
});
