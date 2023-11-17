const router = require("express").Router();
const database = require("../config/db");
const { isMach } = require("../authentication/Password");
const { createAuthToken, verifyAuthToken} = require("../authentication/AuthToken");

router.post("", async (req, res) => {
    try {
        const { email, password } = req.body;
        const collection = database.db(process.env.MONGODB_USER_DB_NAME).collection(process.env.MONGODB_COLLECTION_USER_NAME);
        const user = await collection.findOne({Email: email});

        if (user && await isMach(password, user)) {


            const token = createAuthToken(user);
            const verifyToken = await verifyAuthToken(token);
            user.tokens = user.tokens.concat({ token, iat : verifyToken.iat, exp : verifyToken.exp });
            await collection.updateOne({Email: email}, { $set: { tokens: user.tokens } });

            return res.status(200).json({
                "type": "ok",
                "msg": "login Successful..."
            })
        } else  {
            return res.status(500).json({
                "type": "error",
                "msg": "login Unsuccessful..."
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