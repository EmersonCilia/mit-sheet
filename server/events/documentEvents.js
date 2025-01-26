import { findDocument, updateDocument, deleteDocument, deleteRow } from "../db/documentsDb.js"
import { addConnection, findUserDocument, removeConnection, findConnection } from "../utils/conectionsDocuments.js";

export default function eventRegisterDocument(socket, io) {
    socket.on("select_document", async ({ documentName, userName }, callback) => {
        // When a client selects a document, get the document and send its text
        const document = await findDocument(documentName);
        if (document) {

            const conectionFound = findConnection(documentName, userName);

            if (!conectionFound) {

                socket.join(documentName);

                addConnection({ documentName, userName })

                socket.data = {
                    userEntered: true
                }

                const usersInDocument = findUserDocument(documentName)

                io.to(documentName).emit("user_in_document", usersInDocument)

                callback(document);  // Return the document's text skillname to the client
            } else {
                socket.emit("user_already_in_document")
            }
        } else {
            callback("");  // Return empty if no document is found
        }

        // Listen for text updates from the client
        socket.on("text_editor", async ({ documentName, skillNameInput, timer, damagetotal, damagetaken }) => {
            timer === null ? timer = "" : timer = timer;
            damagetotal === null ? damagetotal = "" : damagetotal = damagetotal; //if timer or damagetotal is null saves as empty string
            damagetaken === null || NaN  ? damagetaken = "" : damagetaken = damagetaken.toFixed(1);
            const update = await updateDocument(documentName, {
                [`${skillNameInput}.skillname`]:skillNameInput,
                [`${skillNameInput}.timer`]:timer,
                [`${skillNameInput}.damagetotal`]:damagetotal,
                [`${skillNameInput}.damagetaken`]:damagetaken
            });
            let data = { name: documentName, [skillNameInput]: { skillname: skillNameInput, timer: timer, damagetotal: damagetotal, damagetaken: damagetaken } }
            if (update.modifiedCount) {
                socket.to(documentName).emit("client_skill_editor", data);
                // Send updated text to other clients
            }
        });
        socket.on("checkbox_editor", async (checkbox, skillNameInput, checked, damagetaken) => {
            // Construct the dynamic path for the checkbox
            damagetaken === null || NaN ? damagetaken = "" : damagetaken = damagetaken.toFixed(1);

            // Use $set to update only the specific checkbox's value
            const updateValue = checked ? true : false;  // Set to true or false based on the checked state

            // Update the document with the correct checkbox value and keep the rest intact
            const update = await updateDocument(documentName, {
                [`${skillNameInput}.${checkbox}`]: updateValue,  // Update checkbox state
                [`${skillNameInput}.damagetaken`]: damagetaken  // Update damage taken value
            });

            // If the update is successful, broadcast the change to other clients
            if (update.modifiedCount) {
                socket.to(documentName).emit("client_checkbox_editor", checkbox, damagetaken);
            }
        });
        socket.on("select_option_editor", async ({ skillNameDiv, selectedType }) => {

            // Construct the dynamic path for the selected option
            const updatePath = `${skillNameDiv}.type`;

            // Update the document with the correct selected option value
            const update = await updateDocument(documentName, {
                [updatePath]: selectedType
            });

            // If the update is successful, broadcast the change to other clients
            if (update.modifiedCount) {
                socket.to(documentName).emit("client_select_option_editor", { selectedType, skillNameDiv });
            };
        })
        socket.on("delete_document", async (name) => {
            const result = await deleteDocument(name);

            if (result.deletedCount) {
                io.emit("delete_document_success", name);
            }
        });
        socket.on("delete_row", async ({ documentName, rowName }) => {
            const result = await deleteRow(documentName, rowName);
            if (result.modifiedCount) {
                io.emit("delete_row_success", rowName);
            }
        });

        socket.on("disconnect", () => {

            if (socket.data.userEntered) {
                removeConnection(documentName, userName)

                const usersInDocument = findUserDocument(documentName)
                io.to(documentName).emit("user_in_document", usersInDocument)
            }
        })
    });
}
