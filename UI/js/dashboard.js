const bars = document.querySelector(".bars");
const navbar = document.querySelector(".nav");
const messageBody = document.querySelector(".main__body");
const composeMessage = document.querySelector(".compose__message_btn");
const overlay = document.querySelector(".overlay");
const clearOverlay = document.querySelector(".clear__overlay");
const inbox = document.querySelector(".inbox");
const sent = document.querySelector(".sent");
const draft = document.querySelector(".draft");
const inboxButton = document.querySelector(".inbox__btn");
const draftButton = document.querySelector(".draft__btn");
const sentButton = document.querySelector(".sent__btn");
const starredButton = document.querySelector(".starred__btn");
const sentBody = document.querySelector(".sent__body");
const inboxBody = document.querySelector(".inbox__body");
const draftBody = document.querySelector(".draft__body");
const starredBody = document.querySelector(".starred__body");

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

inboxButton.addEventListener("click", () => {
  draftButton.classList.remove("active");
  sentButton.classList.remove("active");
  starredButton.classList.remove("active");
  inboxButton.classList.add("active");

  inboxBody.style.display = "block";
  draftBody.style.display = "none";
  sentBody.style.display = "none";
  starredBody.style.display = "none";
});

sentButton.addEventListener("click", () => {
  draftButton.classList.remove("active");
  inboxButton.classList.remove("active");
  starredButton.classList.remove("active");
  sentButton.classList.add("active");

  sentBody.style.display = "block";
  draftBody.style.display = "none";
  inboxBody.style.display = "none";
  starredBody.style.display = "none";
});

draftButton.addEventListener("click", () => {
  inboxButton.classList.remove("active");
  sentButton.classList.remove("active");
  starredButton.classList.remove("active");
  draftButton.classList.add("active");

  draftBody.style.display = "block";
  inboxBody.style.display = "none";
  sentBody.style.display = "none";
  starredBody.style.display = "none";
});

starredButton.addEventListener("click", () => {
  draftButton.classList.remove("active");
  inboxButton.classList.remove("active");
  sentButton.classList.remove("active");
  starredButton.classList.add("active");

  starredBody.style.display = "block";
  draftBody.style.display = "none";
  sentBody.style.display = "none";
  inboxBody.style.display = "none";
});

window.onload = () => {
  inboxButton.classList.add("active");
};
