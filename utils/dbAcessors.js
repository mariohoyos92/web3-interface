const knex = require("../db/connection");

async function checkIfCodeInUse(code) {
    const response = await knex("ico").select("netki_code").where({ netki_code: code });
    return response.length > 0
}

async function addUsertoDB(email, netkiCode) {
    return knex("ico").insert({ email, netki_code: netkiCode })
}

async function getUserByEmail(email) {
    return knex("ico").where({ email }).first();
}


module.exports = { checkIfCodeInUse, addUsertoDB, getUserByEmail }