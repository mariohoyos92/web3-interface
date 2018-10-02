const knex = require("../db/connection");
const {
  getTransaction,
  getCodeHistory,
  getAuthCodes
} = require("../kyc-service");
const {
  getUserByEmail,
  updateNetkiApprovedStatus,
  checkIfCodeInUse,
  addUsertoDB,
  addAddressToUser
} = require("./dbAcessors");
const {
  crowdSaleContract,
  getTransactions,
  tokenContract,
  isAddress
} = require("../web3");
const { EmailStruct, sendEmail } = require("../email/email");

const weiPerEth = 1000000000000000000;

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
        let isWhitelisted = await contractInstance.whitelist(
          public_eth_address
        );
        if (isWhitelisted) {
          res.status(200).json({ approvalStatus, isWhitelisted });
        } else {
          await contractInstance.addAddressToWhitelist(public_eth_address);
          isWhitelisted = await contractInstance.whitelist(public_eth_address);
          await updateNetkiApprovedStatus(email, isWhitelisted);
          res.status(200).json({ approvalStatus, isWhitelisted });
        }
      } else if (approvalStatus === "restarted") {
        const codeHistory = await getCodeHistory(netki_code);
        const { code } = codeHistory.child_codes[0];
        await knex("ico")
          .update({ netki_code: code })
          .where({ email });
        netkiStatusFetcher(req, res);
      } else if (approvalStatus === "failed") {
        await updateNetkiApprovedStatus(email, false);
        res.status(200).json({ approvalStatus, isWhitelisted: false });
      } else {
        res.status(200).json({ approvalStatus, isWhitelisted: false });
      }
    } else {
      res.status(200).json({ approvalStatus: "Hasn't started netki process" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getCrowdSaleStats(req, res) {
  try {
    const contractInstance = await crowdSaleContract;
    const weiRaised = await contractInstance.weiRaised();
    const wanRaised = Math.floor(weiRaised / weiPerEth);
    const tokensSold = await contractInstance.tokensSold();
    const crowdSaleBeingTimeStamp = 1538956800000;
    const timeElapsedSinceCrowdSaleStarted =
      Date.now() - crowdSaleBeingTimeStamp;
    const twoWeeks = 1000 * 60 * 60 * 24 * 14;
    let currentRound, mdxPerWan;
    if (wanRaised > 44000000 || timeElapsedSinceCrowdSaleStarted > twoWeeks) {
      if (
        wanRaised > 44000000 + 15500000 ||
        timeElapsedSinceCrowdSaleStarted > twoWeeks * 2
      ) {
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
    });
  } catch (e) {
    res.status(500).json({
      error: e.message
    });
  }
}

async function getRemainingTokensInRound(req, res) {
  try {
    const contractInstance = await crowdSaleContract;
    const remainingTokensInRound = await contractInstance.roundRemainingTokens();
    res.status(200).json({
      remainingTokensInRound: Math.floor(remainingTokensInRound / weiPerEth)
    });
  } catch (e) {
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
            res.status(200).json({ response });
          }
        });
        break;
      }
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

async function getUserProfile(req, res) {
  const { email } = req.params;
  try {
    const profile = await getUserByEmail(email);
    res.status(200).json({ profile });
  } catch (error) {
    res.status(500).json({
      error
    });
  }
}

async function addAddressToProfile(req, res) {
  const { email, publicAddress } = req.body;
  try {
    const [updatedUser] = await addAddressToUser(email, publicAddress);
    res.status(200).json({ updatedUser });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
}

async function checkIfWhitelisted(req, res) {
  try {
    const { email } = req.params;
    const { public_eth_address } = await getUserByEmail(email);
    const contractInstance = await crowdSaleContract;
    const isWhitelisted = await contractInstance.whitelist(public_eth_address);
    res.status(200).json({
      isWhitelisted
    });
  } catch (e) {
    res.status(500).json({
      error: e.message
    });
  }
}

async function getTransactionHistory(req, res) {
  const { email } = req.params;
  try {
    const { public_eth_address } = await getUserByEmail(email);
    await getTransactions(public_eth_address, (err, txHistory) => {
      if (err) {
        res.status(500).json({ error: err });
      } else if (txHistory.length === 0) {
        res.status(200).json({ transactions: [] });
      } else {
        const formattedTransactions = txHistory.map(tx => {
          return {
            purchaserAddress: tx.args.purchaser,
            beneficiaryAddress: tx.args.beneficiary,
            tokensPurchased: Math.round(tx.args.amount / weiPerEth),
            txHash: tx.transactionHash
          };
        });
        res.status(200).json({ transactions: formattedTransactions });
      }
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

async function getMDXBalance(req, res) {
  try {
    const { email } = req.params;
    const { public_eth_address } = await getUserByEmail(email);
    const tokenInstance = await tokenContract;
    const MDXBalance = await tokenInstance.balanceOf(public_eth_address);
    res.status(200).json({
      MDXBalance: Math.floor(MDXBalance / weiPerEth)
    });
  } catch (e) {
    res.status(500).json({
      error: e.message
    });
  }
}

async function getTotalRemainingTokens(req, res) {
  try {
    const contractInstance = await crowdSaleContract;
    const totalRemainingTokens = await contractInstance.totalRemainingTokens();
    res.status(200).json({
      totalRemainingTokens: Math.floor(totalRemainingTokens / weiPerEth)
    });
  } catch (e) {
    res.status(500).json({
      error: e.message
    });
  }
}

function checkIfAddressIsValid(req, res) {
  const { address } = req.params;
  address ? res.status(200).json({ isValid: isAddress(address) }) : res.status(500).json({ error: "Please provide address" })
}

module.exports = {
  netkiStatusFetcher,
  getCrowdSaleStats,
  getRemainingTokensInRound,
  registerUser,
  getUserProfile,
  addAddressToProfile,
  checkIfWhitelisted,
  getTransactionHistory,
  getMDXBalance,
  getTotalRemainingTokens,
  checkIfAddressIsValid
};
