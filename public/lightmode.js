const switchTheme = document.getElementById("theme-switch");
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem("theme"); //Get theme from local storage
if (savedTheme) {
  body.setAttribute("data-bs-theme", savedTheme);
  switchTheme.checked = savedTheme === "dark";
  switchTheme.nextElementSibling.textContent = switchTheme.checked ? "Dark mode" : "Light mode";
}

// Toggle themes
switchTheme.addEventListener("change", () => {

  const newTheme = switchTheme.checked ? "dark" : "light";

  body.setAttribute("data-bs-theme", newTheme);
  switchTheme.nextElementSibling.textContent = switchTheme.checked ? "Dark mode" : "Light mode";

  //Save theme in local storage
  body.getAttribute("data-bs-theme") === "dark"
    ? localStorage.setItem("theme", newTheme) 
    && localStorage.setItem("switchChecked", switchTheme.checked)
    : localStorage.clear();
});