require("dotenv").config();
const express = require('express');
const { json } = require("body-parser")
const { netkiStatusFetcher, getCrowdSaleStats, getRemainingTokensInRound, registerUser, getUserProfile, addAddressToProfile, checkIfWhitelisted, getTransactionHistory, getMDXBalance, getTotalRemainingTokens } = require("./utils/controllers")


const app = express();
app.use(json());

// Used to send email with netki information

app.post('/netki-registration', registerUser)

// Used to get the profile information for a user via email

app.get('/user-profile/:email', getUserProfile)

// Used to add a public address to a user's profile

app.post("/user/publicAddress", addAddressToProfile)

// Used to get the netki status for a user by their email address

app.get("/netki-status/:email", netkiStatusFetcher)

// Used to check whether an address is whitelisted or not

app.get("/whitelist/:email", checkIfWhitelisted)
// Used to get a transaction history of an address for the crowdsale

app.get('/transaction-history/:email', getTransactionHistory)

// Used to retrieve MDX balance for an address by email

app.get("/mdx-balance/:email", getMDXBalance)

// Used to get the total remaining tokens to be sold across all phases

app.get("/total-remaining-tokens", getTotalRemainingTokens)

// Used to get the tokens remaining to be sold in the current phase

app.get('/remaining-tokens-in-round', getRemainingTokensInRound)

// Used to get Crowdsale stats

app.get('/crowdsale-stats', getCrowdSaleStats)

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port: ${port}`))