import emitUserRegister from "./socket-register.js";

// Get the form element
const form = document.getElementById("form-register");

// Auto redirect to login after register
form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get input values from the form
    const name = form["input-user"].value;
    const password = form["input-password"].value;

    // Emit the user registration data
    emitUserRegister({ name, password });   
});
