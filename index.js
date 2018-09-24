const express = require('express');
const { json } = require("body-parser")
const { crowdSaleContract } = require('./web3');

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

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port: ${port}`))