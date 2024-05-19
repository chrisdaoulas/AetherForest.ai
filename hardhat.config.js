
require("@nomicfoundation/hardhat-toolbox");

//@type import('hardhat/config').HardhatUserConfig

module.exports = {

  solidity: "0.8.19",
  networks: {

    hardhat: {

      chainId: 1337 // Specify the chain ID of your local Hardhat network
    }
  },

 
  paths: {
    artifacts: "./src/artifacts",
  }
};
