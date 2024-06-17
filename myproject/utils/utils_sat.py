import os
import geopandas as gpd
from datetime import datetime, timedelta
import fiona
import pandas as pd
import inspect
from shapely.geometry import Point
import requests
import hashlib
import ee
import time
from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive



def read_python_file(filename):
    with open(filename, 'r') as f:
        return f.read()
    

def save_python_file(contents, filename):
    with open(filename, 'w') as f:
        f.write(contents)    



def delete_files(directory):
    # Iterate over all files in the directory
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        try:
            # Check if it's a file
            if os.path.isfile(filepath):
                os.remove(filepath)  # Delete the file
        except Exception as e:
            print(f"Failed to delete {filepath}. Reason: {e}")


#source: https://africansurveyors.net/converting-kml-files-to-shapefiles-using-python-a-step-by-step-guide/

def kml2shape(kml):
    
    fiona.drvsupport.supported_drivers['KML'] = 'rw'
    os.chdir("C:\\Users\\cdaou\\OneDrive\\Documents\\MSBDGA\\Github\\AmazoniaCoin\\myproject\\satellite_data\\kml\\")
      
    fp = os.path.join(os.getcwd()+"\\"+kml)


    gdf_list = []
    for layer in fiona.listlayers(fp):    
        gdf = gpd.read_file(fp, driver='KML', layer=layer)
        gdf_list.append(gdf)

    gdf = gpd.GeoDataFrame(pd.concat(gdf_list, ignore_index=True))
    #gdf.set_crs('epsg:32721',allow_override=True)

    gpd.io.file.fiona.drvsupport.supported_drivers['ESRI Shapefile'] = 'raw'
    
        
    shapefile = kml[:-4]+'.shp'
    gdf.to_file(shapefile)


    


def four_months_before(date_string):
    # Convert the date string to a datetime object
    date_obj = datetime.strptime(date_string, '%Y-%m-%d')
    
    # Subtract four months from the given date
    four_months_ago = date_obj - timedelta(days=4*30)  # Assuming 30 days per month
    
    return four_months_ago.strftime('%Y-%m-%d')



def eight_months_before(date_string):
    # Convert the date string to a datetime object
    date_obj = datetime.strptime(date_string, '%Y-%m-%d')
    
    # Subtract four months from the given date
    eight_months_ago = date_obj - timedelta(days=8*30)  # Assuming 30 days per month
    
    return eight_months_ago.strftime('%Y-%m-%d')



def get_latest_commit_id():
    url = f"https://api.github.com/repos/chrisdaoulas/AmazoniaCoin/commits"
    response = requests.get(url)
    if response.status_code == 200:
        # Extracting commit ID from the response
        latest_commit_id = response.json()[0]['sha']
        sha256_hash = hashlib.sha256(latest_commit_id.encode()).hexdigest()
        with open("latest_commit_sha256.txt", 'w') as file:
            file.write(sha256_hash)        
    else:
        print(f"Error: Failed to fetch commits (status code: {response.status_code})")
        return None



def check_task_status(task, interval=60):
    """
    Check the status of a Google Earth Engine task at regular intervals.

    Parameters:
    task (str): The GEE task.
    interval (int): The time interval (in seconds) between status checks. Default is 60 seconds.
    """


    while True:
        status = task.status()
        state = status['state']

        if state in ['COMPLETED', 'FAILED', 'CANCELLED']:
            print(f"Task {task}[:38] status: {state}")
            break

        time.sleep(interval)
        

def geelogin():
    os.chdir("C:\\Users\\cdaou\\OneDrive\\Documents\\MSBDGA\\Github\\AmazoniaCoin\\satellite_data\\scripts")

    service_account = 'ee-blockchain@ee-blockchain.iam.gserviceaccount.com'
    private_key_path =os.path.abspath(os.path.dirname(os.getcwd())+'\\.private-key.json')
    credentials = ee.ServiceAccountCredentials(service_account, private_key_path)
    ee.Initialize(credentials, project='ee-blockchain')

# Authenticate to the Google Drive of the Service Account
    gauth = GoogleAuth()
    gauth.LoadClientConfigFile(os.path.dirname(os.getcwd())+'\\secret.json')            
    gauth.LoadCredentialsFile(os.path.dirname(os.getcwd())+'\\mycreds.txt')
    
    if gauth.credentials is None:
        # Authenticate if they're not there
        gauth.settings.update({'get_refresh_token': True})
        gauth.LocalWebserverAuth()
    elif gauth.access_token_expired:
        # Refresh them if expired
    
        gauth.Refresh()
    else:
        # Initialize the saved creds
        #gauth.Authorize()
        gauth.LocalWebserverAuth()
    # Save the current credentials to a file
    gauth.SaveCredentialsFile(os.path.dirname(os.getcwd())+'\\mycreds.txt')
    drive = GoogleDrive(gauth)        




def deploy_smartcontract(w3,chain_id, private_key, my_address):
    

    
    w3.eth.defaultAccount = w3.eth.accounts[0]
     
    # Setting the default account (so we don't need 
    #to set the "from" for every transaction call)
     
    # Path to the compiled contract JSON file
    compiled_contract_path = 'C:/Users/cdaou/OneDrive/Documents/MSBDGA/Github/AmazoniaCoin/src/artifacts/contracts/amazoncoin.sol/AmazonasCoin.json'
     
    # Deployed contract address (see `migrate` command output: 
    # `contract address`)
    # Do Not Copy from here, contract address will be different 
    # for different contracts.
    deployed_contract_address = '0xc5a5C42992dECbae36851359345FE25997F5C42d'
     
    # load contract info as JSON
    with open(compiled_contract_path) as file:
        contract_json = json.load(file)  
         
        # fetch contract's abi - necessary to call its functions
        contract_abi = contract_json['abi']
        
        contract_bytecode = contract_json["bytecode"]
     
    # Fetching deployed contract reference
    amazoncoin = w3.eth.contract(address = deployed_contract_address, abi = contract_abi, bytecode=contract_bytecode)
    
    return amazoncoin


def transfercarbon(to_address,value_to_transfer,cid):
    w3 = Web3(Web3.HTTPProvider("HTTP://127.0.0.1:8545"))
    my_address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

    chain_id = 1337
    private_key = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

    amazoncoin = deploy_smartcontract(w3,chain_id,private_key,my_address)

   
    nonce = w3.eth.get_transaction_count(my_address)
    adjusted_gas_price = 2 + w3.eth.gas_price  # Adjust this value as needed
    
    transaction = amazoncoin.functions.transfer(to_address, value_to_transfer,cid).build_transaction({
        "chainId": chain_id,    
         "gas":2000000,
        "gasPrice": adjusted_gas_price, 
        "from": my_address, 
        "nonce": nonce
    })
    
    
    signed_tx = w3.eth.account.sign_transaction(transaction, private_key=private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    return tx_receipt
    

def deforestation_analysis( cid, project):
    w3 = Web3(Web3.HTTPProvider("HTTP://127.0.0.1:8545"))
    my_address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

    chain_id = 1337
    private_key = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

    amazoncoin = deploy_smartcontract(w3,chain_id,private_key,my_address)

   
    nonce = w3.eth.get_transaction_count(my_address)
    adjusted_gas_price = 2 + w3.eth.gas_price  # Adjust this value as needed
    
    transaction = amazoncoin.functions.deforestation_analysis(cid,project).build_transaction({
        "chainId": chain_id,    
         "gas":2000000,
        "gasPrice": adjusted_gas_price, 
        "from": my_address, 
        "nonce": nonce
    })
    
    
    signed_tx = w3.eth.account.sign_transaction(transaction, private_key=private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    return tx_receipt


