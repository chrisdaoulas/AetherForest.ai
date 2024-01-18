'use client'

import { Alert } from "reactstrap";
import type { NextPage } from 'next';
import Head from 'next/head';
import { lusitana } from '@/app/ui/fonts';
//import contract from '@truffle/contract';

import Web3 from 'web3';
import { VStack, HStack, Heading, Text, Button, Input, Box, Spacer, Spinner } from '@chakra-ui/react';
//import CarbonChainJSON from '@CarbonChain.json';
//import CarbonChainJSON from '@/build/contracts/CarbonChain.json';
import CarbonChainJSON from '@/src/artifacts/contracts/amazoncoin.sol/CarbonChain.json';

import React from 'react';
//import { load, loadAccount, loadContract } from '../src/funcs';

//var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
//const web3 = new Web3('ws://localhost:7545');
//var Contract = require('web3-eth-contract');



export default function Page(){
  
  function Alerts() {
    return (
      <>
        
        <Alert color="success" isOpen={ successAlert }>
          <span className="alert-icon">
            <i className="ni ni-like-2"></i>
          </span>
          <span className="alert-text">
            <strong>Success!</strong>{" "}
            This is a success alert—check it out!
          </span>
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
            onClick={() => {setSuccessAlert(false)}}
          >
              <span aria-hidden="true">&times;</span>
          </button>
      </Alert>
        
      </>
    );
  }
    
  //state variables
  const [inputAddress, setInputAddress] = React.useState<any>(null); //for receiver address any state
  const [inputCredits, setInputCredits] = React.useState<any>(null); //for credits to be sent any state
  const [inputCID, setInputCID] = React.useState<any>(null); //for CID associated to file: to change address any state
  const [inputAccountBalance, setAccountBalance] = React.useState<any>(null); //for credits to be sent any state
  const [refresh, setRefresh] = React.useState<boolean>(true);
  const[balValue,setBalvalue]=React.useState<any>(null);
  const [inputAccount, setInputAccount] = React.useState<any>(null); //for receiver address for allowance
  const [inputAllowance, setInputAllowance] = React.useState<any>(null); //for receiver address any state
  const [inputOffsets, setInputOffsets] = React.useState<any>(null); 
  const [inputAlerts, setInputAlerts] = React.useState<any>(null);
  const [successAlert, setSuccessAlert] = React.useState(); 




  // HANDLERS

  //Event handlers to update the corresponding input states when the user types
  const handleInputChangeAddress = (e:any) => setInputAddress(e.currentTarget.value);
  const handleInputChangeCredits = (e:any) => setInputCredits(e.currentTarget.value);
  const handleInputChangeCID = (e:any) => setInputCID(e.currentTarget.value);
  const handleInputAccountBalance = (e:any) => setAccountBalance(e.currentTarget.value);
  const handleInputAccount = (e:any) => setInputAccount(e.currentTarget.value);
  const handleInputAllowance = (e:any) => setInputAllowance(e.currentTarget.value);
  const handleInputOffsets = (e:any) => setInputOffsets(e.currentTarget.value);

  //Event handle to initiate the amazoncoin.sol's transfer method
  const handleTransfer = async () => {
    //const theContract = contract(CarbonChainJSON);
    //theContract.setProvider('ws://localhost:7545');
    //const theContract = new Contract(CarbonChainJSON);
    //await theContract.at('0xc76736aeB40a1C39f1C2BA381bc121aab8016F6C');
    //onst CarbonChain = await theContract.deployed();
    
    //const theContract = new web3.eth.Contract(CarbonChainJSON.abi,'0xc76736aeB40a1C39f1C2BA381bc121aab8016F6C');
    //let theContract = new web3.eth.Contract(CarbonChainJSON.abi).at('0xc76736aeB40a1C39f1C2BA381bc121aab8016F6C');
    //theContract.setProvider('ws://localhost:7545');
    //const CarbonChain =  theContract.deploy();

    const contractAddress = '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6'; 
    const contract = new web3.eth.Contract(CarbonChainJSON.abi, contractAddress);
    //contract.deploy();

    const accounts = await web3.eth.getAccounts();
    const addressAccount = accounts[0];
    await contract.methods.transfer(inputAddress,inputCredits ,inputCID).send({from: addressAccount});
    //await contract.transfer(inputAddress,inputCredits,inputCID, {from: addressAccount});
    //await CarbonChain.transfer(inputAddress,inputCredits,inputCID, {from: addressAccount});

    setInputAddress('');
    setInputCredits('');
    setInputCID('');
    setRefresh(true);
  
  };

  const handleBalance = async () => {
    //const theContract = contract(CarbonChainJSON);
    //theContract.setProvider('ws://localhost:7545');
    //const theContract = new Contract(CarbonChainJSON);
    //await theContract.at('0xc76736aeB40a1C39f1C2BA381bc121aab8016F6C');
    //onst CarbonChain = await theContract.deployed();
    
    //const theContract = new web3.eth.Contract(CarbonChainJSON.abi,'0xc76736aeB40a1C39f1C2BA381bc121aab8016F6C');
    //let theContract = new web3.eth.Contract(CarbonChainJSON.abi).at('0xc76736aeB40a1C39f1C2BA381bc121aab8016F6C');
    //theContract.setProvider('ws://localhost:7545');
    //const CarbonChain =  theContract.deploy();

    const contractAddress = '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6'; 
    const contract = new web3.eth.Contract(CarbonChainJSON.abi, contractAddress);
    //contract.deploy();

    const accounts = await web3.eth.getAccounts();
    const addressAccount = accounts[0];
    const balance = await contract.methods.balanceOf(inputAccountBalance).call({from: addressAccount}).then();
    const balvalue = balance.toString()
    //System.out.println("Total balance of account is:\t" + balance);
    console.log('Balance: ',balance.toString());
    //await contract.transfer(inputAddress,inputCredits,inputCID, {from: addressAccount});
    //await CarbonChain.transfer(inputAddress,inputCredits,inputCID, {from: addressAccount});

    console.log('Balance Checked')
    setAccountBalance('');
    setRefresh(true);
    
    setBalvalue(balvalue);
    
  
  };

  const handleAllowance = async () => {

    const contractAddress = '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6'; 
    const contract = new web3.eth.Contract(CarbonChainJSON.abi, contractAddress);
    //contract.deploy();

    const accounts = await web3.eth.getAccounts();
    const addressAccount = accounts[0];
    await contract.methods.approve(inputAccount,inputAllowance).send({from: addressAccount}).then();
    //const balvalue = balance.toString()
    //System.out.println("Total balance of account is:\t" + balance);
    console.log('Allowance set for ',inputAllowance);
    //await contract.transfer(inputAddress,inputCredits,inputCID, {from: addressAccount});
    //await CarbonChain.transfer(inputAddress,inputCredits,inputCID, {from: addressAccount});

    console.log('Allowance Approved')
    setInputAccount('');
    setInputAllowance('');
    setRefresh(true);

  };

  const handleOffsets = async () => {

    const contractAddress = '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6'; 
    const contract = new web3.eth.Contract(CarbonChainJSON.abi, contractAddress);
    //contract.deploy();

    const accounts = await web3.eth.getAccounts();
    const addressAccount = accounts[0];
    await contract.methods.claimCarbonOffsets(inputOffsets).send({from:addressAccount}).then();
    //const balvalue = balance.toString()
    //System.out.println("Total balance of account is:\t" + balance);
    //console.log('Allowance set for ',inputOffsets);
    //await contract.transfer(inputAddress,inputCredits,inputCID, {from: addressAccount});
    //await CarbonChain.transfer(inputAddress,inputCredits,inputCID, {from: addressAccount});

    console.log('Offsets Claimed')
    setInputOffsets('');
    setRefresh(true);
    
    setInputAlerts('Carbon Offsets Successfully Claimed');
    Alerts();
  };




  // React useEffect Hook
  //triggers changes when the component mounts or when the dependencies change

  //component layout render

  return (
    <div>
        <Head>
          <title>AmazonCoin</title>
          <meta name="description" content="CarbonChain." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <HStack w='full'>
          <Spacer />
          <div>
            <Spacer />
            <Spacer />
            <Spacer />
            <Spacer />
            <h1 className={`${lusitana.className} text-3xl`}>AmazonCoin Carbon Market Tools</h1>
            <h1 className={`${lusitana.className} text-2xl`}>Stakeholders served: Consortium, Beneficiaries</h1>
            
            <Spacer />
            <Spacer />
            <Spacer />

            <Box h='30px'/>
            <Text className={`${lusitana.className} text-1xl`}>Transfer Triggered AmazonCoin Carbon Credits</Text>

            <HStack w='md'>
              <Input
              type='text'
              size='md'
              placeholder='PES Beneficiary Address'
              onChange={handleInputChangeAddress}
              value={inputAddress}
              />
              <Input
              type='text'
              size='md'
              placeholder='Carbon Credits'
              onChange={handleInputChangeCredits}
              value={inputCredits}
              />     
              <Input
              type='text'
              size='md'
              placeholder='Associated File CID'
              onChange={handleInputChangeCID}
              value={inputCID}
              />                           
              <Button className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              type="button" style={{  margin:  "10px"}} onClick={handleTransfer} bg='green.200'>SEND</Button>

            </HStack>
            <Box h='30px' />
            <Text className={`${lusitana.className} text-1xl`}>Inquire balance of Accounts</Text>
            <Input
              type='text'
              size='md'
              placeholder='Account Balance'
              onChange={handleInputAccountBalance}
              value={inputAccountBalance}
              />
             <Button className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              type="button" style={{margin:"10px"}} onClick={handleBalance} bg='green.200'>BALANCE</Button>
              <Text className={`${lusitana.className} text-0.5x0.5`}>Balance: {balValue}</Text>

              <Box h='30px' />
            <Text className={`${lusitana.className} text-1xl`}>Approve Allowance of Accounts</Text>
            <HStack w='md'>
            <Input
              type='text'
              size='md'
              placeholder='Account'
              onChange={handleInputAccount}
              value={inputAccount}
              />
              <Input
              type='text'
              size='md'
              placeholder='Allowance'
              onChange={handleInputAllowance}
              value={inputAllowance}
              />
              
             <Button className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              type="button" style={{margin:"10px"}} onClick={handleAllowance} bg='green.200'>APPROVE</Button>
              </HStack>
              

              <Box h='30px' />
            <Text className={`${lusitana.className} text-1xl`}>Claim Carbon Offsets</Text>
            <Input
              type='text'
              size='md'
              placeholder='Carbon Offsets'
              onChange={handleInputOffsets}
              value={inputOffsets}
              />
             <Button className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              type="button" style={{margin:"10px"}} onClick={handleOffsets} bg='green.200'>CLAIM</Button>
{/*               <Text className={`${lusitana.className} text-0.5x0.5`}>Balance: {balValue}</Text>
 */}
          </div>
          <Spacer />
        </HStack>
    </div>
  )
} 