import os
import geopandas as gpd
from datetime import datetime, timedelta
import fiona
import pandas as pd
import inspect
from shapely.geometry import Point
import requests
import hashlib



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
    
    #kml = 'uaoi.kml'
    #gpd.io.file.fiona.drvsupport.supported_drivers['KML'] = 'rw'
    fiona.drvsupport.supported_drivers['KML'] = 'rw'

    os.chdir("C:\\Users\\cdaou\\OneDrive\\Documents\\MSBDGA\\Github\\AmazoniaCoin\\satellite_data\\Yanomami")
    
    
    
    fp = os.path.join(os.getcwd(), kml)
    
    

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



