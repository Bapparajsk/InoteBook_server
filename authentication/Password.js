const bcrypt = require("bcryptjs");

const isMach = async ( password, user) => {
    return await bcrypt.compare(password, user.Password);
}

const passwordHash = async (password) => {
    return await bcrypt.hash(password, 10);
}

module.exports = { isMach, passwordHash }