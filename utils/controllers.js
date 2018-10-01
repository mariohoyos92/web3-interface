const knex = require("../db/connection");
const { getTransaction, getCodeHistory } = require('../kyc-service');
const { getUserByEmail, updateNetkiApprovedStatus } = require("./dbAcessors");
const { crowdSaleContract } = require('../web3');

async function netkiStatusFetcher(req, res) {
    const { email } = req.params;

    try {
        const { netki_code, public_eth_address } = await getUserByEmail(email);
        const status = await getTransaction(netki_code);
        const formattedStatus = JSON.parse(status);
        if (formattedStatus.results.length > 0) {
            const userResults = formattedStatus.results[0];
            const approvalStatus = userResults.state;
            if (approvalStatus === "completed") {
                const contractInstance = await crowdSaleContract;
                let isWhitelisted = await contractInstance.whitelist(public_eth_address);
                if (isWhitelisted) {
                    res.status(200).json({ approvalStatus, isWhitelisted })
                } else {
                    await contractInstance.addAddressToWhitelist(public_eth_address);
                    isWhitelisted = await contractInstance.whitelist(public_eth_address);
                    await updateNetkiApprovedStatus(email, isWhitelisted);
                    res.status(200).json({ approvalStatus, isWhitelisted })
                }
            } else if (approvalStatus === "restarted") {
                const codeHistory = await getCodeHistory(netki_code);
                const { code } = codeHistory.child_codes[0];
                await knex("ico").update({ netki_code: code }).where({ email })
                netkiStatusFetcher(req, res);
            } else if (approvalStatus === "failed") {
                await updateNetkiApprovedStatus(email, false);
                res.status(200).json({ approvalStatus, isWhitelisted: false })
            } else {
                res.status(200).json({ approvalStatus, isWhitelisted: false })
            }
        }
        else {
            throw Error("No definitive results for that user yet")
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

module.exports = { netkiStatusFetcher }