const messageBody = document.querySelector(".main__body");
const overlay = document.querySelector(".overlay");
const inboxButton = document.querySelector(".inbox__btn");
const draftButton = document.querySelector(".draft__btn");
const sentButton = document.querySelector(".sent__btn");
const starredButton = document.querySelector(".starred__btn");
const sentBody = document.querySelector(".sent__body");
const inboxBody = document.querySelector(".inbox__body");
const draftBody = document.querySelector(".draft__body");
const starredBody = document.querySelector(".starred__body");
const topNav = document.querySelector(".top__nav");
const readEmail = document.querySelector(".read__email");

document.querySelector(".time__created").textContent = new Date().toUTCString();

document.addEventListener("click", e => {
  if (e.target.parentNode.className == "draft__message") {
    overlay.style.display = "block";
  }

  if (
    e.target.className == "top_nav_inbox__btn" ||
    e.target.className == "top_nav_sent__btn" ||
    e.target.className == "top_nav_draft__btn" ||
    e.target.className == "top_nav_starred__btn"
  ) {
    topNav.classList.toggle("top__navs");
    messageBody.classList.toggle("main__body__height");
  }

  if (e.target.className == "fas fa-bars") {
    topNav.classList.toggle("top__navs");
    messageBody.classList.toggle("main__body__height");
  }

  if (e.target.className == "compose__message_btn") {
    overlay.style.display = "block";
  }

  if (e.target.className == "clear__overlay") {
    overlay.style.display = "none";
  }
  if (
    e.target.classList[0] == "inbox__btn" ||
    e.target.classList[0] == "top_nav_inbox__btn"
  ) {
    draftButton.classList.remove("active");
    sentButton.classList.remove("active");
    starredButton.classList.remove("active");
    inboxButton.classList.add("active");

    inboxBody.style.display = "block";
    draftBody.style.display = "none";
    sentBody.style.display = "none";
    starredBody.style.display = "none";
    readEmail.style.display = "none";
  }

  if (
    e.target.className == "draft__btn" ||
    e.target.className == "top_nav_draft__btn"
  ) {
    inboxButton.classList.remove("active");
    sentButton.classList.remove("active");
    starredButton.classList.remove("active");
    draftButton.classList.add("active");

    draftBody.style.display = "block";
    inboxBody.style.display = "none";
    sentBody.style.display = "none";
    starredBody.style.display = "none";
    readEmail.style.display = "none";
  }

  if (
    e.target.classList[0] == "sent__btn" ||
    e.target.classList[0] == "top_nav_sent__btn"
  ) {
    inboxButton.classList.remove("active");
    draftButton.classList.remove("active");
    starredButton.classList.remove("active");
    sentButton.classList.add("active");

    sentBody.style.display = "block";
    inboxBody.style.display = "none";
    draftBody.style.display = "none";
    starredBody.style.display = "none";
    readEmail.style.display = "none";
  }

  if (
    e.target.className == "starred__btn" ||
    e.target.className == "top_nav_starred__btn"
  ) {
    draftButton.classList.remove("active");
    inboxButton.classList.remove("active");
    sentButton.classList.remove("active");
    starredButton.classList.add("active");

    starredBody.style.display = "block";
    draftBody.style.display = "none";
    sentBody.style.display = "none";
    inboxBody.style.display = "none";
    readEmail.style.display = "none";
  }
  console.log(e.target.classList[0]);

  if (
    e.target.parentNode.className == "inbox__message" ||
    e.target.parentNode.className == "sent__message"
  ) {
    readEmail.style.display = "block";
    draftBody.style.display = "none";
    sentBody.style.display = "none";
    inboxBody.style.display = "none";
    starredBody.style.display = "none";
  }
});

window.onload = () => {
  inboxButton.classList.add("active");
};
