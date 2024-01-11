//'use client'

import { useEffect, useState } from 'react';
import {Web3} from 'web3';
import React from 'react';
import ethers from 'ethers';

//import contract from '@truffle/contract';
import CarbonChainJSON from '@/src/artifacts/contracts/amazoncoin.sol/CarbonChain.json';
//import CarbonChainJSON from '@/build/contracts/CarbonChain.json';
//var Contract = require('web3-eth-contract');

export default function Page(){
  const web3 = new Web3("http://localhost:8545");
  const contractAddress = '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6'; 
  const contract = new web3.eth.Contract(CarbonChainJSON.abi, contractAddress);

  async function pastEvents() {
    
     // const accounts = await web3.eth.getAccounts();
     // const addressAccount = accounts[0];
     // const past = await contract.getPastEvents('allEvents', { fromBlock: 0, toBlock: 10 });
  
    
    return past;
  }


  //  var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));


/*    const handleTransfer = async () => {
        const theContract = contract(CarbonChainJSON);
        theContract.setProvider('ws://localhost:7545');
        const CarbonChain = await theContract.deployed();
        

        const accounts = await web3.eth.getAccounts();
        const addressAccount = accounts[0];
        //const pastEvents = await CarbonChain.getPastEvents('allEvents', { fromBlock: 0, toBlock: 10 });

        //console.log(addressAccount)
      //  return addressAccount;
      //return addressAccount;
      }; */


  return (
    <div>
      <h1>Smart Contract Events</h1>
      <table>
        <thead>
          <tr>
            <th>Event Name</th>            
          </tr>
        </thead>
        <tbody>
            <tr>{pastEvents()}</tr>
        </tbody>
      </table>
    </div>
  ); 
}


/* export default function Page(){
    return <p>Blockchain Page</p>;
} */
