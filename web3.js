const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider("http://localhost:8546");
const contract = require('truffle-contract');

const crowdSale = contract(require('./contracts/MDXCrowdsale.json'));
crowdSale.setProvider(provider);
// Addresses from deterministic ganache_cli blockchain
const crowdSaleOwnerAddress = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1";
const crowdSaleAddress = "0x254dffcd3277c0b1660f6d42efbb754edababc2b";
crowdSale.defaults({
    from: crowdSaleOwnerAddress,
    gas: 1000000
})
const crowdSaleContract = crowdSale.at(crowdSaleAddress).then(instance => instance);

module.exports = { crowdSaleContract }