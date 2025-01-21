import emitAuthenticateUser from "./socket-front-login.js";

const form = document.getElementById("form-login");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form["input-user"].value;
    const password = form["input-password"].value;

    emitAuthenticateUser({ name: name, password: password });
});