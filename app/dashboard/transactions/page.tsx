'use client'

import type { NextPage } from 'next';
import Head from 'next/head';
import contract from '@truffle/contract';

import Web3 from 'web3';
import { VStack, HStack, Heading, Text, Button, Input, Box, Spacer, Spinner } from '@chakra-ui/react';
//import CarbonChainJSON from '@CarbonChain.json';
import CarbonChainJSON from '@/build/contracts/CarbonChain.json';
import React from 'react';
//import { load, loadAccount, loadContract } from '../src/funcs';

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
//const web3 = new Web3('ws://localhost:7545');
//var Contract = require('web3-eth-contract');


export default function Page(){
    
  //state variables
  const [inputAddress, setInputAddress] = React.useState<any>(null); //for receiver address any state
  const [inputCredits, setInputCredits] = React.useState<any>(null); //for credits to be sent any state
  const [inputCID, setInputCID] = React.useState<any>(null); //for CID associated to file: to change address any state
  const [refresh, setRefresh] = React.useState<boolean>(true);


  // HANDLERS

  //Event handlers to update the corresponding input states when the user types
  const handleInputChangeAddress = (e:any) => setInputAddress(e.currentTarget.value);
  const handleInputChangeCredits = (e:any) => setInputCredits(e.currentTarget.value);
  const handleInputChangeCID = (e:any) => setInputCID(e.currentTarget.value);
  
  //Event handle to initiate the amazoncoin.sol's transfer method
  const handleTransfer = async () => {
    const theContract = contract(CarbonChainJSON);
    theContract.setProvider('ws://localhost:7545');
    //const theContract = new Contract(CarbonChainJSON);
    await theContract.at('0xc76736aeB40a1C39f1C2BA381bc121aab8016F6C');
    const CarbonChain = await theContract.deployed();
    
    //const theContract = new web3.eth.Contract(CarbonChainJSON.abi,'0xc76736aeB40a1C39f1C2BA381bc121aab8016F6C');
    //let theContract = new web3.eth.Contract(CarbonChainJSON.abi).at('0xc76736aeB40a1C39f1C2BA381bc121aab8016F6C');
    //theContract.setProvider('ws://localhost:7545');
    //const CarbonChain =  theContract.deploy();
    const accounts = await web3.eth.getAccounts();
    const addressAccount = accounts[0];
    await CarbonChain.transfer(inputAddress,inputCredits,inputCID, {from: addressAccount});
    setInputAddress('');
    setRefresh(true);
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
            <Heading as='h1'>AmazonCoin Carbon Market Tools</Heading>
            <Heading as='h2' size='md' noOfLines={1}>Stakeholders served: Consortium, Beneficiaries</Heading>
            <Box h='30px'/>
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
              <Button onClick={handleTransfer} bg='green.200'>SEND</Button>
            </HStack>
            <Box h='30px' />
            <Text>Available CID</Text>
          </div>
          <Spacer />
        </HStack>
    </div>
  )
} 