require("dotenv").config();
const express = require('express');
const { json } = require("body-parser")
const { crowdSaleContract, getTransactions, tokenContract } = require('./web3');
const { EmailStruct, sendEmail } = require("./email/email");
const { checkIfCodeInUse, addUsertoDB, getUserByEmail, addAddressToUser } = require("./utils/dbAcessors");
const { getAuthCodes } = require('./kyc-service');
const { netkiStatusFetcher } = require("./utils/controllers")


const app = express();
app.use(json());

const weiPerEth = 1000000000000000000

// Used to send email with netki information

app.post('/netki-registration', async (req, res) => {
    try {
        const { email } = req.body;
        const codes = await getAuthCodes();
        for (let i = 0; i < codes.length; i++) {
            let netkiCode = codes[i].code
            const inUse = await checkIfCodeInUse(netkiCode);
            if (!inUse) {
                await addUsertoDB(email, netkiCode);
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
                break;
            }
        }
    } catch (e) {
        res.status(500).json({ error: e })
    }
})

// Used to get the profile information for a user via email

app.get('/user-profile/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const profile = await getUserByEmail(email);
        res.status(200).json({ profile })
    } catch (error) {
        res.status(500).json({
            error
        })
    }
})

// Used to add a public address to a user's profile

app.post("/user/publicAddress", async (req, res) => {
    const { email, publicAddress } = req.body;
    try {
        const updatedUser = await addAddressToUser(email, publicAddress);
        res.status(200).json({ updatedUser });
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e })
    }
})

// Used to get the netki status for a user by their email address

app.get("/netki-status/:email", netkiStatusFetcher)

// Used to check whether an address is whitelisted or not

app.get("/whitelist/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const { public_eth_address } = await getUserByEmail(email);
        const contractInstance = await crowdSaleContract;
        const isWhitelisted = await contractInstance.whitelist(public_eth_address);
        res.status(200).json({
            isWhitelisted
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
})
// Used to get a transaction history of an address for the crowdsale

app.get('/transaction-history/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const { public_eth_address } = await getUserByEmail(email);
        await getTransactions(public_eth_address, (err, txHistory) => {
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
                        tokensPurchased: Math.round(tx.args.amount / weiPerEth),
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

// Used to retrieve MDX balance for an address by email

app.get("/mdx-balance/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const { public_eth_address } = await getUserByEmail(email);
        const tokenInstance = await tokenContract;
        const MDXBalance = await tokenInstance.balanceOf(public_eth_address);
        res.status(200).json({
            MDXBalance: Math.floor(MDXBalance / weiPerEth)
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
            totalRemainingTokens: Math.floor(totalRemainingTokens / weiPerEth)
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
            remainingTokensInRound: Math.floor(remainingTokensInRound / weiPerEth)
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
})

// Used to get Crowdsale stats

app.get('/crowdsale-stats', async (req, res) => {
    try {
        const contractInstance = await crowdSaleContract;
        const weiRaised = await contractInstance.weiRaised();
        const wanRaised = Math.floor(weiRaised / weiPerEth)
        const tokensSold = await contractInstance.tokensSold();
        const crowdSaleBeingTimeStamp = 1538956800000;
        const timeElapsedSinceCrowdSaleStarted = Date.now() - crowdSaleBeingTimeStamp;
        const twoWeeks = 1000 * 60 * 60 * 24 * 14
        let currentRound, mdxPerWan;
        if (wanRaised > 44000000 || timeElapsedSinceCrowdSaleStarted > twoWeeks) {
            if (wanRaised > 44000000 + 15500000 || timeElapsedSinceCrowdSaleStarted > twoWeeks * 2) {
                currentRound = 3;
                mdxPerWan = 11.2;
            } else {
                currentRound = 2;
                mdxPerWan = 12.4;
            }
        } else {
            currentRound = 1;
            mdxPerWan = 17.6;
        }
        res.status(200).json({
            wanRaised,
            tokensSold: Math.floor(tokensSold / weiPerEth),
            currentRound,
            mdxPerWan
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
})




// getAuthCodes()
//     .then(codes => getTransaction(codes[0].code))
//     .then(console.log)
//     .catch(err => console.log(err));

// getTransaction('bmx6h6').then(console.log); //test transaction


const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port: ${port}`))