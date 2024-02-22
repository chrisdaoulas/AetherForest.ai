
##PINATA

import os
import requests
from pinatapy import PinataPy
from dotenv import load_dotenv
load_dotenv()  # take environment variables from .env.

def upload_ipfs_pinata(filename):
    # Connect to the IPFS cloud service
    #pinata_api_key=str(os.environ.get('PinataAPIKey'))
    #pinata_secret_api_key=str(os.environ.get('PinataAPISecret'))
    pinata = PinataPy('850afe3890f605cf95b7','86f4050f81ba6e16392f8ca88b92bd3592f3340d9e11c7d088174f2dd4220be9')

    # Upload the file
    result = pinata.pin_file_to_ipfs(filename)

    # Should return the CID (unique identifier) of the file
    #print(result)

    # Anything waiting to be done?
    #print(pinata.pin_jobs())

    # List of items we have pinned so far
    #print(pinata.pin_list())

    # Total data in use
    #print(pinata.user_pinned_data_total())

    # Get our pinned item
    #gateway="https://gateway.pinata.cloud/ipfs/"
    gateway="https://ipfs.io/ipfs/"

    filehash = result['IpfsHash']
    
    return filehash