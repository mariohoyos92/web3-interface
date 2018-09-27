require("dotenv").config();
const express = require('express');
const { json } = require("body-parser")
const { crowdSaleContract, getTransactions } = require('./web3');
const { EmailStruct, sendEmail } = require("./email/email");

const { getAuthCodes, getTransaction } = require('./kyc-service');

const app = express();
app.use(json());

// Used to add an address to the whitelist

app.post("/whitelist", async (req, res) => {
    const { address } = req.body;
    try {
        const contractInstance = await crowdSaleContract;
        const transactionInfo = await contractInstance.addAddressToWhitelist(address);
        const isWhitelisted = await contractInstance.whitelist(address);
        res.status(200).json({
            transactionInfo,
            isWhitelisted
        })

    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

// Used to remove an address from the whitelist

app.delete("/whitelist/:address", async (req, res) => {
    const { address } = req.params;
    try {
        const contractInstance = await crowdSaleContract;
        const transactionInfo = await contractInstance.removeAddressFromWhitelist(address);
        const isWhitelisted = await contractInstance.whitelist(address);
        res.status(200).json({
            transactionInfo,
            isWhitelisted
        })

    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});

// Used to check whether an address is whitelisted or not

app.get("/whitelist/:address", async (req, res) => {
    try {
        const { address } = req.params;
        const contractInstance = await crowdSaleContract;
        const isWhitelisted = await contractInstance.whitelist(address);
        res.status(200).json({
            isWhitelisted
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
})

// Used to get the total remaining tokens to be sold across all phases

app.get("/total-remaining-tokens", async (req, res) => {
    try {
        const contractInstance = await crowdSaleContract;
        const totalRemainingTokens = await contractInstance.totalRemainingTokens();
        res.status(200).json({
            totalRemainingTokens
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
})

// Used to get the tokens remaining to be sold in the current phase

app.get('/remaining-tokens-in-round', async (req, res) => {
    try {
        const contractInstance = await crowdSaleContract;
        const remainingTokensInRound = await contractInstance.roundRemainingTokens();
        res.status(200).json({
            remainingTokensInRound
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
})

// Used to send email with netki infor

app.post('/netki-registration', async (req, res) => {
    try {
        const { email, netkiCode } = req.body;
        const draft = new EmailStruct(
            email,
            "BlockMedx: Verify Identity",
            "netki-registration",
            { netkiCode }
        );
        sendEmail(draft, (err, response) => {
            if (err) {
                res.status(500).json({ error: err })
            } else {
                res.status(200).json({ response })
            }

        });

    } catch (e) {
        res.status(500).json({ error: e })
    }
})


// Used to get a transaction history of an address for the crowdsale

app.get('/transaction-history/:publicAddress', async (req, res) => {
    const { publicAddress } = req.params;
    try {
        await getTransactions(publicAddress, (err, txHistory) => {
            if (err) {
                res.status(500).json({ error: err })
            }
            else if (txHistory.length === 0) {
                res.status(200).json({ transactions: [] })
            } else {
                const formattedTransactions = txHistory.map(tx => {
                    return {
                        purchaserAddress: tx.args.purchaser,
                        beneficiaryAddress: tx.args.beneficiary,
                        tokensPurchased: tx.args.amount.toString(),
                        txHash: tx.transactionHash
                    }
                })
                res.status(200).json({ transactions: formattedTransactions })
            }
        });
    } catch (e) {
        res.status(500).json({ error: e })
    }
})


getAuthCodes()
    .then(codes => getTransaction(codes[0].code))
    .then(console.log)
    .catch(err => console.log(err));

getTransaction('bmx6h6').then(console.log); //test transaction


const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port: ${port}`))