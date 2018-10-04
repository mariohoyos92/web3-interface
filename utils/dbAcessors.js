const knex = require("../db/connection");

async function checkIfCodeInUse(code) {
  const response = await knex("ico")
    .select("netki_code")
    .where({ netki_code: code });
  return response.length > 0;
}

async function addUsertoDB(email, netkiCode) {
  return knex("ico").insert({ email, netki_code: netkiCode });
}

async function getUserByEmail(providedEmail) {
  const { id, email, netki_code, netki_approved } = await knex("ico")
    .where({ email: providedEmail })
    .first();
  const wallets = await knex("wallets").where({ user_id: id })
  return {
    email,
    netki_code,
    netki_approved,
    wallets
  }
}

async function addAddressToUser(email, publicAddress) {
  return knex("ico").select("*")
    .where({ email }).first().then(({ id }) => knex("wallets").insert({ user_id: id, public_eth_address: publicAddress }).returning("public_eth_address"))
}

async function updateNetkiApprovedStatus(email, status) {
  return knex("ico")
    .update({ netki_approved: status })
    .where({ email });
}

async function getUserByNetkiCode(netkiCode) {
  const { id, email, netki_code, netki_approved } = await knex("ico").where({ netki_code: netkiCode }).first();
  const wallets = await knex("wallets").where({ user_id: id });
  return {
    email,
    netki_code,
    netki_approved,
    wallets
  }
}


function updateWhitelistStatus(publicAddress, status) {
  return knex("wallets").update({ is_whitelisted: status }).where({ public_eth_address: publicAddress })
}

function updateUserNetkiCode(email, netkiCode) {
  return knex("ico")
    .update({ netki_code: netkiCode })
    .where({ email });
}
module.exports = {
  checkIfCodeInUse,
  addUsertoDB,
  getUserByEmail,
  addAddressToUser,
  updateNetkiApprovedStatus,
  getUserByNetkiCode,
  updateWhitelistStatus,
  updateUserNetkiCode
};
