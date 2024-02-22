# -*- coding: utf-8 -*-
"""
Created on Thu Dec  7 06:12:08 2023

@author: cdaou



"""
from SQL_database import *

#1. Query the SQL database


sql_query_string = """
    SELECT * FROM Deforestation_Rate

"""

result_df = sql_query_to_pd(sql_query_string, db_name='defrate.db')
result_df

n_rows=len(result_df)

#2. Define Avoided Deforestation and carbon credits

deforestationavoided = result_df.iloc[n_rows-1,0]-result_df.iloc[n_rows-2,0]

if deforestationavoided<0:
    carboncredits = abs(10*deforestationavoided) #10 credits per 1% of avoided deforestation
else:
    carboncredits=0
    
carboncredits = 10

cid = result_df.iloc[n_rows-1,2] 
#3. Call smart contract

#amazoncoin2 = w3.eth.contract(address=contract_address, abi=abi)
amazoncoin2 = w3.eth.contract(address=deployed_contract_address, abi=contract_abi)

to_address = "0xF6B30d6D06A23e7eb4db9C45092315aD1b7F3Af5"

value_to_transfer = int(carboncredits)  # Adjust the value as needed

def transfercarbon(to_address,value_to_transfer,cid):
   
    nonce = w3.eth.get_transaction_count(my_address)
    adjusted_gas_price = 2 + w3.eth.gas_price  # Adjust this value as needed
    
    transaction = amazoncoin2.functions.transfer(to_address, value_to_transfer,cid).build_transaction({
        "chainId": chain_id,    
         "gas":2000000,
        "gasPrice": adjusted_gas_price, 
        "from": my_address, 
        "nonce": nonce
    })
    
    
    signed_tx = w3.eth.account.sign_transaction(transaction, private_key=private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    events = amazoncoin2.events.Transfer().process_receipt(tx_receipt)

    return events

    

transfercarbon(to_address, value_to_transfer,cid)



def approvecarbon(address,value_to_approve):
   
    nonce = w3.eth.get_transaction_count(my_address)
    adjusted_gas_price = 2 + w3.eth.gas_price  # Adjust this value as needed
    
    transaction = amazoncoin2.functions.approve(address, value_to_approve).build_transaction({
        "chainId": chain_id,    
         "gas":2000000,
        "gasPrice": adjusted_gas_price, 
        "from": my_address, 
        "nonce": nonce
    })
    
    
    signed_tx = w3.eth.account.sign_transaction(transaction, private_key=private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    events = amazoncoin2.events.Approval().process_receipt(tx_receipt)

    return events

to_address = "0xF6B30d6D06A23e7eb4db9C45092315aD1b7F3Af5"
value_to_approve = 30

approvecarbon(to_address,value_to_approve)

##CANT SEE EVENTS! CREATE A TRUFFLE PROJECT!



##inquire balance
balance = amazoncoin2.functions.balanceOf("0xF6B30d6D06A23e7eb4db9C45092315aD1b7F3Af5").call()

##inquire symbol
symbol = amazoncoin2.functions.symbol().call()




##EVENTS
all_events = [item for item in amazoncoin2.abi if item['type'] == 'event']


# Print the names of all events
for event in all_events:
    print(f"Event name: {event['name']}")


# Get all Transfer events
transfer_events = amazoncoin2.events.Transfer().get_logs(fromBlock=0)


# Decode and print each event
def decode_events(transfer_events):
    for event in transfer_events:
        
        # Extract relevant data from the decoded event
        from_address = event['args']['from']
        to_address = event['args']['to']
        value = event['args']['value']
        eventype= event['event']
        
        print(f"{eventype} event: From {from_address} to {to_address}, Value: {value}")

decode_events(transfer_events)

