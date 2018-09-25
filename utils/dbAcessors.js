const knex = require("../db/connection");

async function checkIfCodeExists(code) {
    const response = await knex("ico").select("netki_code").where({ netki_code: code });
    return response.length > 0
}



module.exports = { checkIfCodeExists }