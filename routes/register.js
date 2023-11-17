const router = require("express").Router();
const database = require("../config/db");
const { passwordHash } = require("../authentication/Password");
const { createAuthToken, verifyAuthToken } = require("../authentication/AuthToken");

router.post("", async (req, res) => {
    try {
        const collection = database.db(process.env.MONGODB_USER_DB_NAME).collection(process.env.MONGODB_COLLECTION_USER_NAME);
        const { name, userName, email, password } = req.body;

        if (await collection.findOne({Email : email})) {
            return res.status(500).json({
                "type": "error",
                "msg" : "email already exists",
                "email": email
            });
        }

        if ( name || userName || email || password ) {
            const newUser = {
                Name : name,
                UserName : userName,
                Email : email,
                Password : `${await passwordHash(password)}`
            }

            await collection.insertOne(newUser);
            const user = await collection.findOne({Email: email});
            const token = createAuthToken(user);
            const verifyToken = await verifyAuthToken(token);
            user.tokens = user.tokens ? user.tokens.concat({ token, iat : verifyToken.iat, exp : verifyToken.exp }) : [{ token, iat : verifyToken.iat, exp : verifyToken.exp }];
            await collection.updateOne({Email: email}, { $set: { tokens: user.tokens } });

            return res.status(201).json({
                "type": "ok",
                "msg" : "data insert successful..."
            })
        } else {
            return res.status(402).json({
                "type": "error",
                "msg" : "isEmpty error",
                "name": `${name ? name + " ": " "}${userName ? userName + " ": " "}${email ? email + " ": " "}${password ? password + " ": " "}`
            })
        }

    } catch (e) {
        console.log("Error " + e);
        return res.status(402).json({
            "type": "error",
            "msg" : `unscripted error ${e}` ,
        })
    }
})

module.exports = router;