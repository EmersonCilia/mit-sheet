const conectionsDocument = [];

function findConnection(documentName, userName){
    return conectionsDocument.find((conection) => {
        return (
            conection.documentName === documentName && 
            conection.userName === userName);
    });
}

function addConnection(conection) {
    conectionsDocument.push(conection);
}

function findUserDocument(documentName){
    return conectionsDocument
    .filter((conection) => conection.documentName === documentName)
    .map((conection)=> conection.userName)
}

function removeConnection(documentName, userName){
    const index = conectionsDocument.findIndex((conection) => {
        return (
            conection.documentName === documentName && 
            conection.userName === userName);
    });
    if(index !== -1){
        conectionsDocument.splice(index, 1)
    }
}

export { addConnection, findUserDocument, removeConnection, findConnection }