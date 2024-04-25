'use client'

import Head from 'next/head';
import { lusitana } from '@/app/ui/fonts';

import Web3 from 'web3';
import { VStack, HStack, Heading, Text, Button, Input, Box, Spacer, Spinner, chakra } from '@chakra-ui/react';
import CarbonChainJSON from '@/src/artifacts/contracts/amazoncoin.sol/CarbonChain.json';
import React, { useContext } from 'react';
import { UserContext} from '@/app/components/context';



//var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const contractAddress = process.env.NEXT_PUBLIC_HARDHAT; 

//const web3 = new Web3('ws://localhost:7545');
//var Contract = require('web3-eth-contract');


  //Alerts
  
  export default function Page(){
  
  //User Context
  const {user} = useContext(UserContext);
  

  //state variables
  const [inputAddress, setInputAddress] = React.useState<any>(''); //for receiver address any state
  const [inputCredits, setInputCredits] = React.useState<any>(''); //for credits to be sent any state
  const [inputCID, setInputCID] = React.useState<any>(''); //for CID associated to file: to change address any state
  const [inputAccountBalance, setAccountBalance] = React.useState<any>(''); //for credits to be sent any state
  const [refresh, setRefresh] = React.useState<boolean>(true);
  const[balValue,setBalvalue]=React.useState<any>('');
  const [inputAccount, setInputAccount] = React.useState<any>(''); //for receiver address for allowance
  const [inputAllowance, setInputAllowance] = React.useState<any>(''); //for receiver address any state
  const [inputOffsets, setInputOffsets] = React.useState<any>('');
  const [showSuccessNotification, setShowSuccessNotification] = React.useState<boolean>(false);
  const [inputBuyTokens, setInputBuyTokens] = React.useState<any>('');
  const [inputSellTokens, setInputSellTokens] = React.useState<any>('');
  const[offValue,setOffValue]=React.useState<any>(''  );
  
 
  const [inputAlerts, setInputAlerts] = React.useState<any>(null);
  //const [successAlert, setSuccessAlert] = React.useState(); 

 
  function SuccessNotification() {
    return (
      <div className="mb-4 rounded-lg bg-green-600 bg-success-100 px-6 py-5 text-white text-success-700" role="alert">
      <strong>Success!</strong> {inputAlerts}
      <button onClick={() => setShowSuccessNotification(false)} className="float-right">
        Close
      </button>
    </div>
    );
  }

  // HANDLERS

  //Event handlers to update the corresponding input states when the user types
  const handleInputChangeAddress = (e:any) => setInputAddress(e.currentTarget.value);
  const handleInputChangeCredits = (e:any) => setInputCredits(e.currentTarget.value);
  const handleInputChangeCID = (e:any) => setInputCID(e.currentTarget.value);
  const handleInputAccountBalance = (e:any) => setAccountBalance(e.currentTarget.value);
  const handleInputAccount = (e:any) => setInputAccount(e.currentTarget.value);
  const handleInputAllowance = (e:any) => setInputAllowance(e.currentTarget.value);
  const handleInputOffsets = (e:any) => setInputOffsets(e.currentTarget.value);
  const handleInputBuyTokens = (e:any) => setInputBuyTokens(e.currentTarget.value);
  const handleInputSellTokens = (e:any) => setInputSellTokens(e.currentTarget.value);
  

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
    setShowSuccessNotification(true);

    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 5000);
    setInputAlerts('Transfer Successful');
  
  };

  const handleBalance = async () => {
 
    const contract = new web3.eth.Contract(CarbonChainJSON.abi, contractAddress);
    const accounts = await web3.eth.getAccounts();
    const addressAccount = accounts[0];
    const balance = await contract.methods.balanceOf(inputAccountBalance).call({from: addressAccount}).then();
    const balvalue = balance.toString()
    console.log('Balance: ',balance.toString());
    console.log('Balance Checked')
    setAccountBalance('');
    setRefresh(true);
    
    setBalvalue(balvalue);
    
  
  };

  const handleAllowance = async () => {

    const contract = new web3.eth.Contract(CarbonChainJSON.abi, contractAddress);
    const accounts = await web3.eth.getAccounts();
    const addressAccount = accounts[0];
    await contract.methods.approve(inputAccount,inputAllowance).send({from: addressAccount}).then();
    console.log('Allowance set for ',inputAllowance);
    console.log('Allowance Approved')
    setInputAccount('');
    setInputAllowance('');
    setRefresh(true);

    setShowSuccessNotification(true);

    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 5000);
    setInputAlerts('Allowance Successfully Approved');

  };

  const handleOffsets = async () => {

    const contract = new web3.eth.Contract(CarbonChainJSON.abi, contractAddress);
    const accounts = await web3.eth.getAccounts();
    const addressAccount = accounts[0];
    await contract.methods.claimCarbonOffsets(inputOffsets).send({from:addressAccount}).then();
    const carbonOffsets = await contract.methods.carbonOffs().call({from:addressAccount}).then();;
    console.log('Offsets Claimed')
    setInputOffsets('');
    setRefresh(true);
    setOffValue(carbonOffsets.toString());
    
    setShowSuccessNotification(true);

    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 5000);
    setInputAlerts('Carbon Offsets Successfully Claimed');
    
  };


  const handleBuyTokens = async () => {
 
    const contract = new web3.eth.Contract(CarbonChainJSON.abi, contractAddress);
    const accounts = await web3.eth.getAccounts();
    const addressAccount = accounts[1];
    await contract.methods.buyTokens(inputBuyTokens).send({from: addressAccount}).then();
    console.log('Tokens Bought')
    setInputBuyTokens('');
    setRefresh(true);
  
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 5000);
    setInputAlerts('Tokens Successfully Bought');
  
  };

  // React useEffect Hook
  //triggers changes when the component mounts or when the dependencies change

  //component layout render
  
  const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 2
        }}
    />
  );

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
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
            <h1 className={`${lusitana.className} text-3xl`}>AetherForest.Ai Carbon Market Tools</h1>
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
            <ColoredLine color="grey" />
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
              <ColoredLine color="grey" />
              
            <Box h='30px' />

        {user?.role === 'Consortium' && (
          <>
            <Text className={`${lusitana.className} text-1xl`}>Approve Allowance of Accounts</Text>
            <HStack w='full'>
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
              
              <ColoredLine color="grey" />
              <Box h='30px' />
              </>
        )}
              
        {user?.role != 'Beneficiaries' && (        
          <>
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
              <Text className={`${lusitana.className} text-0.5x0.5`}>Offsets: {offValue}</Text>
              <ColoredLine color="grey" />


              <Box h='30px' />
                 
        

            <Text className={`${lusitana.className} text-1xl`}>Buy Tokens</Text>
            <Input
              type='text'
              size='md'
              placeholder='Number of Tokens'
              onChange={handleInputBuyTokens}
              value={inputBuyTokens}
              />
             <Button className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              type="button" style={{margin:"10px"}} onClick={handleBuyTokens} bg='green.200'>BUY</Button>
              
              <ColoredLine color="grey" />
              
            <Box h='30px' />
            </>  
            )}

              {showSuccessNotification && <SuccessNotification />}
              
          </div>
          <Spacer />
        </HStack>
        </div>
    </div>
  );
};






