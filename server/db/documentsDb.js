import { documentsColection } from "./dbConnect.js";

//crud function

//get all
function getAllDocuments() {
  try {
    const documents = documentsColection.find().toArray();
    return documents;
  } catch (error) {
    console.error("Error at getting document:", error);
    throw error;
  }
}

// create
async function addDocument(name) {
    try {
        const result = await documentsColection.insertOne({ name });
        return result;
    } catch (error) {
        console.error("Error adding document:", error);
        throw error;
    }
}

//find one
function findDocument(name) {
  try {
    const document = documentsColection.findOne({
      name,
    });
    return document;
  } catch (error) {
    console.error("Error at fiding document:", error);
    throw error;
  }

}

//update
function updateDocument(name, data) {
  try {
    const update = documentsColection.updateOne(
      { name }, //matches the document that it will be saved
      {
        $set: {
          ...data
        },
      }
    );
    return update;
  } catch (error) {
    console.error("Error at updating document:", error);
    throw error;
  }
}

//delete
function deleteDocument(name) {
  try {
    const result = documentsColection.deleteOne({
      name,
    });
  
    return result;
  } catch (error) {
    console.error("Error at deleting document:", error);
    throw error;
  }
}
  
function deleteRow(documentName, Rowname){
  try {
    const result = documentsColection.updateOne(
      { name: documentName },
      { $unset: { [Rowname]: ""} },
    );

    return result
  } catch (error) {
    console.error("Error at deleting row:", error);
    throw error;
  }
}

export {
  findDocument,
  updateDocument,
  getAllDocuments,
  addDocument,
  deleteDocument,
  deleteRow
};