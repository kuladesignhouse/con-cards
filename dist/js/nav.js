var burg = document.getElementById("burg");
var menu = document.getElementById("menu");
var logo = document.getElementById("cclogo");
burg.addEventListener("click", function(e) {
  if (!burg.classList.contains("is-active")) {
    burg.classList.add("is-active");
    menu.classList.add("open");
    logo.classList.add("slide");
  } else {
    burg.classList.remove("is-active");
    menu.classList.remove("open");
    logo.classList.remove("slide");
  }
});