import addDocEmit from "./socket-front.js";
import { removeCookie } from "./utils/cookies.js";

const btnLogout = document.getElementById("btn-logout");
const docList = document.getElementById("list-doc");
const form = document.getElementById("form-add-doc");
const inputDoc = document.getElementById("input-doc");

//logoff button event, returns to login/index
btnLogout.addEventListener("click", () => {
  removeCookie("tokenJwt");
  alert("Logoff sucessful!");
  window.location.href = "login/index.html";
});

//submit button event, it will create a new doc input.value as name
form.addEventListener("submit", (e) => {
  e.preventDefault();
  addDocEmit(inputDoc.value); //this function from socket-front.js will trigger a chain of function from socket.io to create a doc
  inputDoc.value = "";
});

//function to insert dinamically a document on lobby
function insertDocument (documentName){
  docList.innerHTML += `
  <a href="/document/index.html?name=${documentName}" class="list-group-item list-group-item-action" id="document-${documentName}">
      ${documentName}
  </a>`;
}
//function to delete dinamically a document on lobby
function removeDocumentLink(name) {
  const documentElement = document.getElementById(`document-${name}`);
  if (documentElement) {
    docList.removeChild(documentElement);
  }
}
export { insertDocument, removeDocumentLink }