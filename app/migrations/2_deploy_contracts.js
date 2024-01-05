
const CarbonChain = artifacts.require("CarbonChain");  
const initialSupply=10000000;
const tokenName="AmazonCoin";
const tokenSymbol="AMZ";
const decimalUnits=2;
const pricePerToken=1;

module.exports = function (deployer) {
  deployer.deploy(CarbonChain,tokenName, tokenSymbol, decimalUnits, initialSupply,pricePerToken)
};