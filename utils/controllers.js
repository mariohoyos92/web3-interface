const knex = require("../db/connection");
const {
  getTransaction,
  getAuthCodes
} = require("../kyc-service");
const {
  getUserByEmail,
  updateNetkiApprovedStatus,
  checkIfCodeInUse,
  addUsertoDB,
  addAddressToUser,
  getUserByNetkiCode,
  updateWhitelistStatus,
} = require("./dbAcessors");
const {
  crowdSaleContract,
  getTransactions,
  tokenContract,
  isAddress,
  getBalance,
  formatTransactions
} = require("../web3");
const { EmailStruct, sendEmail } = require("../email/email");

const weiPerEth = 1000000000000000000;

async function getEverything(req, res) {
  const { email } = req.params;
  console.log("geteverythinPARAm", email);
  try {
    const { wallets, netki_code } = await getUserByEmail(email);
    const stats = await statsFetcher();
    const tokenInstance = await tokenContract;
    const contractInstance = await crowdSaleContract;
    let netkiApprovalStatus = await checkNetkiStatus(
      netki_code,
      email,
    )

    let walletStatus = await Promise.all(wallets.map(({ public_eth_address }) => {
      return new Promise(async (resolve, reject) => {
        try {
          let isWhitelisted = await contractInstance.whitelist(public_eth_address);
          let MDXBalance = await tokenInstance.balanceOf(public_eth_address);
          let wanBalance = await getBalance(public_eth_address)
          let transactionHistory = await txHistoryFetcher(public_eth_address)
          resolve({
            address: public_eth_address,
            isWhitelisted,
            MDXBalance: MDXBalance.dividedBy(weiPerEth).toNumber(),
            wanBalance: wanBalance / weiPerEth,
            transactionHistory
          })
        } catch (error) {
          console.log("in get everything promise map", error)
          resolve({
            address: public_eth_address,
            isWhitelisted: false,
            MDXBalance: 0,
            wanBalance: 0,
            transactionHistory: []
          })
        }
      })
    }));
    res
      .status(200)
      .json({
        walletStatus,
        crowdSaleStats: stats,
        approvalStatus: netkiApprovalStatus,
        netkiCode: netki_code
      });
  } catch (e) {
    console.log("geteverything", e);
    res.status(500).json({ e });
  }
}

async function netkiStatusFetcher(req, res) {
  const { email } = req.params;

  try {
    const { netki_code, wallets } = await getUserByEmail(email);
    const status = await getTransaction(netki_code);
    const formattedStatus = JSON.parse(status);
    if (formattedStatus.results.length > 0) {
      const userResults = formattedStatus.results[0];
      const approvalStatus = userResults.state;
      if (approvalStatus === "completed") {
        const contractInstance = await crowdSaleContract;
        let walletArray = await Promise.all(wallets.map(({ public_eth_address }) => contractInstance.whitelist(
          public_eth_address
        ).then(result => {
          return { address: public_eth_address, isWhitelisted: result }
        })));

        const statusArray = await Promise.all(walletArray.map(address => {
          if (address.isWhitelisted) {
            return address
          } else {
            return contractInstance.addAddressToWhitelist(address.address).then(() => updateWhitelistStatus(address.address, true).then(() => { return { address: address.address, isWhitelisted: true } })
            )
          }
        }))
        await updateNetkiApprovedStatus(email, true);
        res.status(200).json({ walletStatus: statusArray, approvalStatus });
      } else if (approvalStatus === "failed") {
        await updateNetkiApprovedStatus(email, false);
        res.status(200).json({ approvalStatus });
      } else {
        res.status(200).json({ approvalStatus });
      }
    } else {
      res.status(200).json({ approvalStatus: "Hasn't started netki process" });
    }
  } catch (error) {
    console.log("netkistatusfetcher", error)
    res.status(500).json({ error: error.message });
  }
}

async function getCrowdSaleStats(req, res) {
  try {
    const stats = await statsFetcher();
    res.status(200).json(stats);
  } catch (e) {
    console.log("crowdsale stats", e)
    res.status(500).json({
      error: e.message
    });
  }
}

async function registerUser(req, res) {
  try {
    const { email } = req.body;
    const codes = await getAuthCodes();
    for (let i = 0; i < codes.length; i++) {
      let netkiCode = codes[i].code;
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
            res.status(500).json({ error: err });
          } else {
            res.status(200).json({ response, netkiCode });
          }
        });
        break;
      }
    }
  } catch (e) {
    console.log("register user", e)
    res.status(500).json({ error: e });
  }
}

async function getUserProfile(req, res) {
  const { email } = req.params;
  try {
    const profile = await getUserByEmail(email);
    res.status(200).json({ profile });
  } catch (error) {
    console.log("get profile ", e)
    res.status(500).json({
      error
    });
  }
}

async function addAddressToProfile(req, res) {
  const { email, publicAddress } = req.body;
  try {
    await addAddressToUser(email, publicAddress);
    const user = await getUserByEmail(email);
    if (user.netki_approved) {
      const contractInstance = await crowdSaleContract;
      await contractInstance.addAddressToWhitelist(publicAddress)
      await updateWhitelistStatus(publicAddress, true)
      const updatedUser = await getUserByEmail(email);
      res.status(200).json({ updatedUser });
    } else {
      const updatedUser = await getUserByEmail(email);
      res.status(200).json({ updatedUser });
    }
  } catch (e) {
    console.log("addAddressToprofile", e);
    res.status(500).json({ error: e });
  }
}

async function checkIfWhitelisted(req, res) {
  try {
    const { email } = req.params;
    const { wallets } = await getUserByEmail(email);
    const contractInstance = await crowdSaleContract;
    const isWhitelisted = await Promise.all(wallets.map(({ public_eth_address }) =>
      contractInstance.whitelist(public_eth_address).then(result => {
        return { address: public_eth_address, isWhitelisted: result }
      })
    ))
    res.status(200).json({
      isWhitelisted
    });
  } catch (e) {
    console.log("check if whitelisted", e)
    res.status(500).json({
      error: e.message
    });
  }
}

async function getTransactionHistory(req, res) {
  const { email } = req.params;
  try {
    const { wallets } = await getUserByEmail(email);

    const transactionHistory = await Promise.all(wallets.map(({ public_eth_address }) => new Promise((resolve, reject) => {
      getTransactions(public_eth_address, async (err, txHistory) => {
        if (err) {
          reject(err)
        } else if (txHistory.length === 0) {
          resolve({ address: public_eth_address, transactions: [] })
        } else {
          const formattedTransactions = txHistory.map(formatTransactions);
          resolve({ address: public_eth_address, transactions: formattedTransactions })
        }
      })
    })))
    res.status(200).json({ transactionHistory })
  } catch (e) {
    console.log("get transaction history", e)
    res.status(500).json({ error: e });
  }
}

async function getMDXBalance(req, res) {
  try {
    const { email } = req.params;
    const { wallets } = await getUserByEmail(email);
    const tokenInstance = await tokenContract;
    const MDXBalances = await Promise.all(wallets.map(({ public_eth_address }) => tokenInstance.balanceOf(public_eth_address).then((balance) => {
      return { address: public_eth_address, MDXBalance: Math.floor(balance / weiPerEth) }
    })))
    res.status(200).json({
      MDXBalances
    });
  } catch (e) {
    console.log("get mdx balance", e)
    res.status(500).json({
      error: e.message
    });
  }
}

function checkIfAddressIsValid(req, res) {
  const { address } = req.params;
  address
    ? res.status(200).json({ isValid: true })
    : res.status(500).json({ error: "Please provide address" });
}

async function getWanBalance(req, res) {
  try {
    const wanBalance = await getBalance(req.params.address);
    res.status(200).json({ wanBalance: Math.floor(wanBalance / weiPerEth) })
  } catch (error) {
    console.log("get wan balance", error)
    res.status(500).json({ error: error.messgae })
  }

}

async function handleCallback(req, res) {
  try {
    const netkiCode = req.body.identity.transaction_identity.identity_access_code.code;
    const { state } = req.body.identity;
    const { email, wallets } = await getUserByNetkiCode(netkiCode);
    if (state === "completed") {
      await updateNetkiApprovedStatus(email, true);
      if (wallets.length > 0) {
        const contractInstance = await crowdSaleContract;
        await Promise.all(wallets.map(
          async ({ public_eth_address }) => {
            await contractInstance.addAddressToWhitelist(public_eth_address);
            await updateWhitelistStatus(public_eth_address, true)
          }
        ));
        const draft = new EmailStruct(
          email,
          "BlockMedx KYC Verification Complete!",
          "netki-approval-email",
          {}
        );
        sendEmail(draft, (err, response) => {
          if (err) {
            res.status(500).json({ status: "error" });
          } else {
            res.status(200).json({ status: "success" });
          }
        });
      } else {
        const draft = new EmailStruct(
          email,
          "BlockMedx KYC Verification Complete!",
          "netki-approval-add-address",
          {}
        );
        sendEmail(draft, (err, response) => {
          if (err) {
            res.status(500).json({ status: "error" });
          } else {
            res.status(200).json({ status: "success" });
          }
        })
      }

    } else if (state === "failed") {
      await updateNetkiApprovedStatus(email, false);
      const draft = new EmailStruct(
        email,
        "BlockMedx KYC Verification Failed :(",
        "netki-failure",
        {}
      );
      sendEmail(draft, (err, response) => {
        if (err) {
          res.status(500).json({ status: "error" });
        } else {
          res.status(200).json({ status: "success" });
        }
      });
    } else {
      res.status(200).json({ status: "success" });
    }

    // TO DO determine if we want to do anything for HOLD status or anything like that, i don't think it's necessary but could go here.
  } catch (e) {
    console.log("callback", e);
    res.status(500)
  }
}

module.exports = {
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
};

async function statsFetcher() {
  const contractInstance = await crowdSaleContract;
  const [totalRemainingTokens,
    remainingTokensInRound,
    timeRemainingInRound,
    currentRound] = await contractInstance.getInfo();
  const weiRaised = await contractInstance.weiRaised();
  const wanRaised = Math.floor(weiRaised / weiPerEth);
  const tokensSold = await contractInstance.tokensSold();
  let mdxPerWan;
  if (currentRound == 0) {
    mdxPerWan = 17.6;
  } else if (currentRound == 1) {
    mdxPerWan = 11.2
  } else {
    mdxPerWan = 12.4
  }
  return {
    wanRaised,
    tokensSold: Math.floor(tokensSold / weiPerEth),
    currentRound,
    mdxPerWan,
    remainingTokensInRound: Math.floor(remainingTokensInRound / weiPerEth),
    totalRemainingTokens: Math.floor(totalRemainingTokens / weiPerEth),
    timeRemainingInRound: parseInt(timeRemainingInRound * 1000)
  };
}

async function checkNetkiStatus(
  netkiCode,
  email
) {
  if (!netkiCode) return "No netki code associated with user";
  try {
    const status = await getTransaction(netkiCode);
    const formattedStatus = JSON.parse(status);
    let approvalStatus;
    if (formattedStatus.results.length > 0) {
      const userResults = formattedStatus.results[0];
      approvalStatus = userResults.state;
      if (approvalStatus === "completed") {
        await updateNetkiApprovedStatus(email, true);
      }
      else if (approvalStatus === "failed") {
        await updateNetkiApprovedStatus(email, false);
      }
    } else {
      approvalStatus = "Hasn't started netki process";
    }
    return approvalStatus
  } catch (error) {
    throw error;
  }
}

async function txHistoryFetcher(publicEthAddress) {
  return new Promise((resolve, reject) => {
    getTransactions(
      publicEthAddress,
      (err, txHistory) => {
        if (err) {
          resolve([])
        } else {
          const formattedTransactions = txHistory.map(formatTransactions);
          resolve(formattedTransactions)
        }
      }
    )
  })
}

// getTransaction('bmxkf6').then(res => console.log(JSON.parse(res).results[0].transaction_identity.identity_access_code.code))
// const draft = new EmailStruct(
//   "mariohoyos92@gmail.com",
//   "BlockMedx KYC Verification Complete!",
//   "netki-approval-add-address",
//   {}
// );
// sendEmail(draft, (err, response) => {
//   if (err) {
//     console.log(err)
//   } else {
//     console.log(response)
//   }
// });