//'use client'


const Web3 = require('web3');


const CarbonChainJSON =require('C:/Users/cdaou/OneDrive/Documents/MSBDGA/Github/AmazoniaCoin/src/artifacts/contracts/amazoncoin.sol/CarbonChain.json');


  const web3 = new Web3("http://localhost:8545");



  const contractAddress = '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6'; 
  const contract = new web3.eth.Contract(CarbonChainJSON.abi, contractAddress);

  async function pastEvents() {
    
      const accounts = await web3.eth.getAccounts();
      const addressAccount = accounts[0];
      const past = await contract.getPastEvents('allEvents', { fromBlock: 0, toBlock: 10 });
  
    
    return past;
  }

  pastEvents();