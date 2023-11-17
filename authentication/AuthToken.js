const jwt = require("jsonwebtoken");
const database = require("../config/db");


const authToken = (user) => {
    console.log(user._id);
    return jwt.sign({id : user._id}, process.env.PAYLODE, {
        expiresIn: '30D'
    });
}

const verifyAuthToken = async (token) => {
    const collection = database.db(process.env.MONGODB_USER_DB_NAME).collection(process.env.MONGODB_COLLECTION_USER_NAME);
    return  jwt.verify(token, process.env.PAYLODE);
}

module.exports = { createAuthToken: authToken, verifyAuthToken };