// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.



const hre = require("hardhat");



async function main() {


	theContract = await hre.ethers.getContractFactory("AmazonasCoin");




	await hre.ethers.getSigners();

	carbon = await theContract.deploy('AmazonasCoin', 'AMZ', 1,1000000,1);
        //await carbon.deployed();


	console.log("AmazonasCoin deployed to:", carbon.address);
}
  
	


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
