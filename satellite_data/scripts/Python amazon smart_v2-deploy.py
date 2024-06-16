# -*- coding: utf-8 -*-
"""
Created on Tue Dec  5 07:04:59 2023

@author: cdaou
"""

# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""

import pandas as pd
import sqlite3
from eth_utils import address
from web3 import Web3
import os
# install_solc("0.8.0")
from solcx import compile_standard, install_solc
from dotenv import load_dotenv
import json

load_dotenv()



"""Read smart contract"""


os.chdir('C:\\Users\\cdaou\\OneDrive\\Documents\\MSBDGA\\Smart_Contract\\')

"""

with open("./amazoncoin.sol", "r") as file:
    simple_storage_file = file.read()
    
compiled_sol = compile_standard(
    {
        "language": "Solidity",
        "sources": {"amazoncoin.sol": {"content": simple_storage_file}},
        "settings": {
            "outputSelection": {
                "*": {
                    "*": ["abi", "metadata", "evm.bytecode", "evm.bytecode.sourceMap","evm.deployedBytecode", "evm.deployedSourceMap"]
                }
            }
        },
    },
    solc_version="0.8.0",
)


with open("compiled_code.json", "w") as file:
    json.dump(compiled_sol, file)


# get bytecode
bytecode = compiled_sol["contracts"]["amazoncoin.sol"]["CarbonChain"]["evm"][
    "bytecode"
]["object"]


# get abi
abi = json.loads(
    compiled_sol["contracts"]["amazoncoin.sol"]["CarbonChain"]["metadata"]
)["output"]["abi"]
"""



# set up connection
w3 = Web3(Web3.HTTPProvider("HTTP://127.0.0.1:8545"))
chain_id = 1337
my_address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
#private_key = os.getenv("PRIVATE_KEY")
private_key = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

w3.eth.defaultAccount = w3.eth.accounts[0]
 
# Setting the default account (so we don't need 
#to set the "from" for every transaction call)
 
# Path to the compiled contract JSON file
compiled_contract_path = 'C:/Users/cdaou/OneDrive/Documents/MSBDGA/Github/AmazoniaCoin/src/artifacts/contracts/amazoncoin.sol/AmazonasCoin.json'
 
# Deployed contract address (see `migrate` command output: 
# `contract address`)
# Do Not Copy from here, contract address will be different 
# for different contracts.
deployed_contract_address = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
 
# load contract info as JSON
with open(compiled_contract_path) as file:
    contract_json = json.load(file)  
     
    # fetch contract's abi - necessary to call its functions
    contract_abi = contract_json['abi']
    
    contract_bytecode = contract_json["bytecode"]
 
# Fetching deployed contract reference
amazoncoin = w3.eth.contract(address = deployed_contract_address, abi = contract_abi,bytecode=contract_bytecode)

# initialize contract(previous version)
#amazoncoin = w3.eth.contract(abi=abi, bytecode=bytecode)


nonce = w3.eth.get_transaction_count(my_address)

#ATTENTION! Better deploy contracts with truffle and then query with Python!
""""
# set up transaction from constructor which executes when firstly

#always remember to add the constructor arguments when deploying the smart contract
transaction = amazoncoin.constructor("AmazonCoins","AMZ",2,10000000,1).build_transaction(
    {"chainId": chain_id,    
     "gas":2000000,
    "gasPrice": w3.eth.gas_price, 
    "from": my_address,
    "nonce": nonce}
)

signed_tx = w3.eth.account.sign_transaction(transaction, private_key=private_key)
tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
contract_address = tx_receipt['contractAddress']

"""

# Get the balance in wei
balance_wei = w3.eth.get_balance(my_address)

# Convert the balance from wei to ether
balance_ether = w3.from_wei(balance_wei, 'ether')
balance_ether



# Get a list of all function names
function_names = [fn['name'] for fn in amazoncoin.abi if fn['type'] == 'function']

# Print the list of function names
print("List of Smart Contract Functions:")
for name in function_names:
    print(name)