import { updateSkillRows, updateSkillText, checkboxUpdater, typeUpdater,
   refineSucessAuthorization, updateUsersInterface, alertAndRedirect, deleteAndUpdateRow } from "./index.js";
import { findCookie } from "../utils/cookies.js";

const socket = io("/users", {
  auth: {
    token: findCookie("tokenJwt")
  }
});

socket.on("success_authorization", refineSucessAuthorization)


//redirect to login page if not logged
socket.on("connect_error", (error) => {
  alert(`${error}\n\n You need to be loged first`);
  window.location.href = "/login/index.html";
})

function selectDocument(name) {
  // Emit the 'select_document' event to the server
  socket.emit("select_document", name, (data) => {
    // Iterate over each property in the data object
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "name" && key !== "_id") {
        updateSkillRows(value); // Execute updateTextEditor for each skill object
        const skillNameDiv = value.skillname
        const selectedType = value.type || "magical"
        typeUpdater(skillNameDiv, selectedType);  
      }
    });  // Update the text editor with the document's text  // Update the text editor with the document's text
  });
}

socket.on("user_already_in_document", () => {
  alert("Document is already open in another tab");
  window.location.href = "/";
})

socket.on("user_in_document", updateUsersInterface)

function emitRowsValue(data) {
  socket.emit("text_editor", data);
}
function emitCheckboxValue(checkbox, skillNameInput, checked, damagetaken) {
  socket.emit("checkbox_editor", checkbox, skillNameInput, checked, damagetaken);
}
function emitSelectOption(data) {
  socket.emit("select_option_editor", data)
}
function emitDeleteDocument(name) {
  socket.emit("delete_document", name);
}
function emitDeleteRow (names){
  socket.emit("delete_row", names)
}

socket.on("client_skill_editor", (data) => {
  updateSkillText(data)
});
socket.on("client_checkbox_editor", (checkboxId, damagetaken) => {
  checkboxUpdater(checkboxId, damagetaken)
});
socket.on("client_select_option_editor", ({ skillNameDiv, selectedType }) => {
  typeUpdater(skillNameDiv, selectedType);
});
socket.on("delete_document_success", (name) => {
  alertAndRedirect(name);
});
socket.on("delete_row_success", (name) => {
  deleteAndUpdateRow(name)
})
export { emitRowsValue, selectDocument, emitCheckboxValue, emitSelectOption, emitDeleteDocument, emitDeleteRow };