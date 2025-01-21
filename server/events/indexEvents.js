import { getAllDocuments, findDocument, addDocument } from "../db/documentsDb.js"

export default function eventRegisterIndex(socket, io) {
    // Emit all documents when the client requests it
    socket.on("get_documents", async (sendDocuments) => {
        const documents = await getAllDocuments(); // Fetch all documents from the database
        sendDocuments(documents); // Send them to the client     
    });

    socket.on("add_doc", async (name) => {
        const existingDoc = await findDocument(name); // Check if the document already exists
        if (existingDoc) {
            socket.emit("doc_exists", name); // Notify the client if the document exists
        } else {
            const result = await addDocument(name); // Add the document to the database

            if (result.acknowledged) {
                io.emit("add_doc_interface", name); // Notify all clients to update the DOM
                console.log("Document added successfully");
            } else {
                console.error("Failed to add document");
            }
        }
    });
}