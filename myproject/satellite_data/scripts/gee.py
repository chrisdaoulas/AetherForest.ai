import ee
import os



#Authentication for google drive
from google.oauth2 import service_account
from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive
from oauth2client.service_account import ServiceAccountCredentials


def geeauth():

    

    service_account = 'ee-blockchain@ee-blockchain.iam.gserviceaccount.com'
    private_key_path =os.path.abspath(os.path.dirname(os.getcwd())+'\\.private-key.json')
    credentials = ee.ServiceAccountCredentials(service_account, private_key_path)
    ee.Initialize(credentials, project='ee-blockchain')




    # Authenticate to the Google Drive of the Service Account
    gauth = GoogleAuth()
    gauth.LoadClientConfigFile(os.path.dirname(os.getcwd())+'\\secret.json')
    

    #gauth.LoadCredentialsFile(os.environ[u'GOOGLE_APPLICATION_CREDENTIALS'])


    #gauth.LocalWebserverAuth()
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
        gauth.Authorize()
    # Save the current credentials to a file
    gauth.SaveCredentialsFile(os.path.dirname(os.getcwd())+'\\mycreds.txt')
    drive = GoogleDrive(gauth)

