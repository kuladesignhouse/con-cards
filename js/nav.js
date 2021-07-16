var burg = document.getElementById("burg");
var menu = document.getElementById("menu");
burg.addEventListener("click", function(e) {
  if (!burg.classList.contains("is-active")) {
    burg.classList.add("is-active");
    menu.classList.add("open");
  } else {
    burg.classList.remove("is-active");
    menu.classList.remove("open");
  }
});