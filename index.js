require("dotenv").config();
const express = require("express");
const { json } = require("body-parser");
const {
  netkiStatusFetcher,
  getCrowdSaleStats,
  registerUser,
  getUserProfile,
  addAddressToProfile,
  checkIfWhitelisted,
  getTransactionHistory,
  getMDXBalance,
  checkIfAddressIsValid,
  getEverything,
  getWanBalance
} = require("./utils/controllers");

const app = express();
app.use(json());

// Used to send email with netki information

app.post("/netki-registration", registerUser);

// Used to add a public address to a user's profile

app.post("/user/publicAddress", addAddressToProfile);

// Master endpoint to return all of the information for a user/crowdsale info

app.get("/everything/:email", getEverything);

// Used to get the profile information for a user via email

app.get("/user-profile/:email", getUserProfile);

// Used to get the netki status for a user by their email address

app.get("/netki-status/:email", netkiStatusFetcher);

// Used to check whether an address is whitelisted or not

app.get("/whitelist/:email", checkIfWhitelisted);

// Used to get a transaction history of an address for the crowdsale

app.get("/transaction-history/:email", getTransactionHistory);

// Used to check if provided address is valid

app.get("/is-valid-address/:address", checkIfAddressIsValid);

// Used to retrieve MDX balance for an address by email

app.get("/mdx-balance/:email", getMDXBalance);

// Used to get Crowdsale stats

app.get("/crowdsale-stats", getCrowdSaleStats);

// Used to get WAN balance

app.get("/wan-balance/:address", getWanBalance)



// Used to handle callbacks from netki

app.post("/callback", async (req, res) => {
  res.status(200).json({ status: "success" });
  // find netki-code in body
  // find status in body
  // pull user out of db by netki-code
  // if no user, do nothing?
  //
  // if status === completed
  //    if there is a user, change netki-approved to true
  //    if that user has an ethereum address go ahead and whitelist it now
  //    send an email to the user letting them know they've been approved with directions on what to do next
  //
  // if status === failed
  //    change netki-approved to false
  //    send email to user about rejection OR send email to Michael to check in dashboard for restarting OR both.
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port: ${port}`));

module.exports = app;
