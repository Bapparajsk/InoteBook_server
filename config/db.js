const { MongoClient } = require("mongodb");
let database;
async function run() {
    const uri = `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_PASSWOED}@cluster0.pqihv9s.mongodb.net/?retryWrites=true&w=majority`;
    database = new MongoClient(uri);
    await database.connect();
}

run().then(() => {
    console.log("MongoDB connect successful...")
}).catch((e) => {
    console.log("MongoDB connect Unsuccessful...")
})

module.exports = database;