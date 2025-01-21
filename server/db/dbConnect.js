import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);

let documentsColection, usersColection;

try{
    await client.connect();

    const db = client.db("Documents");
    documentsColection = db.collection("Documents");
    usersColection = db.collection("Users");
    console.log("db connection sucessful")
}catch(error){
    console.log(error)
}

export { documentsColection, usersColection };