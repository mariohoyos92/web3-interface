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
  getWanBalance,
  handleCallback
} = require("./utils/controllers");

const app = express();
app.use(json());

// Used to send email with netki information

app.post("/netki-registration", registerUser);

// {
//   "response": [
//     {
//       "statusCode": 202,
//       "headers": {
//         "server": "nginx",
//         "date": "Thu, 04 Oct 2018 22:38:42 GMT",
//         "content-type": "text/plain; charset=utf-8",
//         "content-length": "0",
//         "connection": "close",
//         "x-message-id": "F0zqD_FyQ0qudql8sL26Qw",
//         "access-control-allow-origin": "https://sendgrid.api-docs.io",
//         "access-control-allow-methods": "POST",
//         "access-control-allow-headers": "Authorization, Content-Type, On-behalf-of, x-sg-elas-acl",
//         "access-control-max-age": "600",
//         "x-no-cors-reason": "https://sendgrid.com/docs/Classroom/Basics/API/cors.html"
//       },
//       "request": {
//         "uri": {
//           "protocol": "https:",
//           "slashes": true,
//           "auth": null,
//           "host": "api.sendgrid.com",
//           "port": 443,
//           "hostname": "api.sendgrid.com",
//           "hash": null,
//           "search": null,
//           "query": null,
//           "pathname": "/v3/mail/send",
//           "path": "/v3/mail/send",
//           "href": "https://api.sendgrid.com/v3/mail/send"
//         },
//         "method": "POST",
//         "headers": {
//           "Accept": "application/json",
//           "User-agent": "sendgrid/6.3.0;nodejs",
//           "Authorization": "Bearer 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",
//           "content-type": "application/json",
//           "content-length": 22832
//         }
//       }
//     },
//     null
//   ]
// }


// Used to add a public address to a user's profile

app.post("/user/publicAddress", addAddressToProfile);
// {
//   "updatedUser": {
//     "email": "mariohoyos92@gmail.com",
//       "netki_code": "bmxh75",
//         "netki_approved": false,
//           "wallets": [
//             {
//               "wallet_id": 13,
//               "user_id": 6,
//               "public_eth_address": "0x662f8cB054558ce284d670c374C25C6a3312d3F11",
//               "is_whitelisted": false
//             },
//             {
//               "wallet_id": 14,
//               "user_id": 6,
//               "public_eth_address": "0x662f8cC054558ce284d670c374C25C6a3312d3F11",
//               "is_whitelisted": false
//             }
//           ]
//   }
// }



// Master endpoint to return all of the information for a user/crowdsale info

app.get("/everything/:email", getEverything);

// {
//   "walletStatus": [
//     {
//       "address": "0xd03ea8624c8c5987235048901fb614fdca89b117",
//       "isWhitelisted": true,
//       "MDXBalance": 9152,
//       "wanBalance": 10000000,
//       "transactionHistory": [
//         {
//           "purchaserAddress": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
//           "beneficiaryAddress": "0xd03ea8624c8c5987235048901fb614fdca89b117",
//           "tokensPurchased": 2288,
//           "txHash": "0x79be89212a29169de501b4da88db2e0df7de6ade366df086655634f5aafd3ebc",
//           "transactionTime": "October 2nd 2018, 1:13:28 pm"
//         },
//         {
//           "purchaserAddress": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
//           "beneficiaryAddress": "0xd03ea8624c8c5987235048901fb614fdca89b117",
//           "tokensPurchased": 2288,
//           "txHash": "0x9318518ca06187405220968b7c9f7b0ede3a5b5a449b40c824635eba821e2c8a",
//           "transactionTime": "October 2nd 2018, 1:14:08 pm"
//         },
//         {
//           "purchaserAddress": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
//           "beneficiaryAddress": "0xd03ea8624c8c5987235048901fb614fdca89b117",
//           "tokensPurchased": 2288,
//           "txHash": "0x6078a23ed3f0a37862263ef5b940cafa23057af5f2f1eccf6b2826d6f9e07601",
//           "transactionTime": "October 3rd 2018, 10:14:31 am"
//         },
//         {
//           "purchaserAddress": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
//           "beneficiaryAddress": "0xd03ea8624c8c5987235048901fb614fdca89b117",
//           "tokensPurchased": 2288,
//           "txHash": "0x035b4fb41806267872054b46642aa87f3fb496bbc588afe0f97d6f4450eee62e",
//           "transactionTime": "October 3rd 2018, 10:14:36 am"
//         }
//       ]
//     },
//     {
//       "address": "0xd03ea8624c8c5987235048901fb614fdca89b118",
//       "isWhitelisted": true,
//       "MDXBalance": 9152,
//       "wanBalance": 10000000,
//       "transactionHistory": []
//     }
//   ],
//     "crowdSaleStats": {
//     "wanRaised": 520,
//       "tokensSold": 9152,
//         "currentRound": "0",
//           "mdxPerWan": 17.6,
//             "remainingTokensInRound": 43990848,
//               "totalRemainingTokens": 60991648,
//                 "timeRemainingInRound": 1019868
//   },
//   "approvalStatus": "completed"
// }

// Used to get the profile information for a user via email

app.get("/user-profile/:email", getUserProfile);

// {
//   "profile": {
//     "email": "mario@blockmedx.com",
//       "netki_code": "bmxsc9",
//         "netki_approved": true,
//           "wallets": [
//             {
//               "wallet_id": 1,
//               "user_id": 1,
//               "public_eth_address": "0xd03ea8624c8c5987235048901fb614fdca89b117",
//               "is_whitelisted": true
//             },
//             {
//               "wallet_id": 2,
//               "user_id": 1,
//               "public_eth_address": "0xd03ea8624c8c5987235048901fb614fdca89b118",
//               "is_whitelisted": true
//             }
//           ]
//   }
// }

// Used to get the netki status for a user by their email address

app.get("/netki-status/:email", netkiStatusFetcher);

// {
//   "walletStatus": [
//     {
//       "address": "0xd03ea8624c8c5987235048901fb614fdca89b117",
//       "isWhitelisted": true
//     },
//     {
//       "address": "0xd03ea8624c8c5987235048901fb614fdca89b118",
//       "isWhitelisted": true
//     }
//   ],
//     "approvalStatus": "completed"
// }

// Used to check whether an address is whitelisted or not

app.get("/whitelist/:email", checkIfWhitelisted);

// {
//   "isWhitelisted": [
//     {
//       "address": "0xd03ea8624c8c5987235048901fb614fdca89b117",
//       "isWhitelisted": true
//     },
//     {
//       "address": "0xd03ea8624c8c5987235048901fb614fdca89b118",
//       "isWhitelisted": true
//     }
//   ]
// }

// Used to get a transaction history of an address for the crowdsale

app.get("/transaction-history/:email", getTransactionHistory);

// {
//   "transactionHistory": [
//     {
//       "address": "0xd03ea8624c8c5987235048901fb614fdca89b117",
//       "transactions": [
//         {
//           "purchaserAddress": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
//           "beneficiaryAddress": "0xd03ea8624c8c5987235048901fb614fdca89b117",
//           "tokensPurchased": 2288,
//           "txHash": "0x79be89212a29169de501b4da88db2e0df7de6ade366df086655634f5aafd3ebc",
//           "transactionTime": "October 2nd 2018, 1:13:28 pm"
//         },
//         {
//           "purchaserAddress": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
//           "beneficiaryAddress": "0xd03ea8624c8c5987235048901fb614fdca89b117",
//           "tokensPurchased": 2288,
//           "txHash": "0x9318518ca06187405220968b7c9f7b0ede3a5b5a449b40c824635eba821e2c8a",
//           "transactionTime": "October 2nd 2018, 1:14:08 pm"
//         },
//         {
//           "purchaserAddress": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
//           "beneficiaryAddress": "0xd03ea8624c8c5987235048901fb614fdca89b117",
//           "tokensPurchased": 2288,
//           "txHash": "0x6078a23ed3f0a37862263ef5b940cafa23057af5f2f1eccf6b2826d6f9e07601",
//           "transactionTime": "October 3rd 2018, 10:14:31 am"
//         },
//         {
//           "purchaserAddress": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
//           "beneficiaryAddress": "0xd03ea8624c8c5987235048901fb614fdca89b117",
//           "tokensPurchased": 2288,
//           "txHash": "0x035b4fb41806267872054b46642aa87f3fb496bbc588afe0f97d6f4450eee62e",
//           "transactionTime": "October 3rd 2018, 10:14:36 am"
//         }
//       ]
//     },
//     {
//       "address": "0xd03ea8624c8c5987235048901fb614fdca89b118",
//       "transactions": []
//     }
//   ]
// }

// Used to check if provided address is valid

app.get("/is-valid-address/:address", checkIfAddressIsValid);

// {
//   "isValid": true
// }

// Used to retrieve MDX balance for an address by email

app.get("/mdx-balance/:email", getMDXBalance);

// {
//   "MDXBalances": [
//     {
//       "address": "0xd03ea8624c8c5987235048901fb614fdca89b117",
//       "MDXBalance": 9152
//     },
//     {
//       "address": "0xd03ea8624c8c5987235048901fb614fdca89b118",
//       "MDXBalance": 0
//     }
//   ]
// }

// Used to get Crowdsale stats

app.get("/crowdsale-stats", getCrowdSaleStats);

// {
//   "wanRaised": 520,
//    "tokensSold": 9152,
//    "currentRound": "0",
//    "mdxPerWan": 17.6,
//    "remainingTokensInRound": 43990848,
//    "totalRemainingTokens": 60991648,
//    "timeRemainingInRound": 1019709000
// }

// Used to get WAN balance

app.get("/wan-balance/:address", getWanBalance)


// {
//   "wanBalance": 10000000
// }

// Used to handle callbacks from netki

app.post("/callback", handleCallback);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port: ${port}`));

module.exports = app;
