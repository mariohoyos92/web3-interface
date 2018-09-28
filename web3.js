require("dotenv").config();
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(process.env.PROVIDER || "http://104.43.140.141:8546");
const contract = require('truffle-contract');

const crowdSale = contract(require('./contracts/MDXCrowdsale.json'));
crowdSale.setProvider(provider);
// Addresses from deterministic ganache_cli blockchain
const crowdSaleOwnerAddress = process.env.CROWDSALE_OWNER_ADDRESS || "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1";
const crowdSaleAddress = process.env.CROWDSALE_CONTRACT_ADDRESS || "0x5017a545b09ab9a30499de7f431df0855bcb7275";
crowdSale.defaults({
    from: crowdSaleOwnerAddress,
    gas: 1000000
})
const crowdSaleContract = crowdSale.at(crowdSaleAddress).then(instance => instance);


async function getTransactions(address, callback) {
    const instance = await crowdSaleContract;
    instance.TokenPurchase({ beneficiary: address }, { fromBlock: 0, toBlock: 'latest' }).get((err, res) => {
        callback(err, res)
    });
}

// Dummy function I've been using to buy tokens to see that amounts change
// crowdSaleContract.then(instance => instance.buyTokens("0x662f8cA054558ce284d670c374C25C6a3312d3F7", { value: 13000000000000000000 }))

module.exports = { crowdSaleContract, getTransactions }