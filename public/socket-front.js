import { insertDocument, removeDocumentLink } from "./index.js";
import { findCookie } from "./utils/cookies.js";

const socket = io("/users", {
    auth: {
        token: findCookie("tokenJwt")
    }
});
//redirect to login page if not logged
socket.on("connect_error", (error) => {
    alert(`${error}\n\n You need to be loged first`);
    window.location.href = "/login/index.html";
})
// Fetch all documents when the page loads
socket.emit("get_documents", (documents) => {
    documents.forEach((document) => {
        insertDocument(document.name); // Insert each document into the DOM
    });
});
// Listen for successful document creation and update the DOM
socket.on("add_doc_interface", (name) => {
    insertDocument(name); // Update the DOM with the new document
});
// Listen for document already exists error
socket.on("doc_exists", (name) => {
    alert(`The document "${name}" already exists!`);
});
//update dinamically the deleted document for the person on lobby
socket.on("delete_document_success", (name) => {
    removeDocumentLink(name);
});
// Emit add_doc event when submitting the form
export default function addDocEmit(name) {
    socket.emit("add_doc", name); // Trigger server-side function to add the document
}