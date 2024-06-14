
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse

#from utils.utils_sat import four_months_before


# Earth Engine Python API
import ee
import os
import time
import geemap

import pandas as pd
from datetime import date
from datetime import datetime

from google.oauth2 import service_account
from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive
from oauth2client.service_account import ServiceAccountCredentials



import folium
from utils.utils_sat import four_months_before, read_python_file, save_python_file, get_latest_commit_id, delete_files, kml2shape, eight_months_before,check_task_status, geelogin
from utils.SQL_database import pd_to_sqlDB, row_to_sql, sql_query_to_pd, remove_last_sql
from utils.IPFS import upload_ipfs_pinata
import shutil


import json
import fiona
import geopandas as gpd
import os

from django.views.decorators.csrf import csrf_exempt
import json
import logging


def satellite_analysis(project):
    os.chdir("C:\\Users\\cdaou\\OneDrive\\Documents\\MSBDGA\\Github\\AmazoniaCoin\\satellite_data\\scripts")

    
    file_contents = read_python_file(os.getcwd()+"//satellite_function.py")
    
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
    
    
    # Define the URL format used for Earth Engine generated map tiles.
    EE_TILES = 'https://earthengine.googleapis.com/map/{mapid}/{{z}}/{{x}}/{{y}}?token={token}'
    

    #shape = gpd.read_file(os.path.dirname(os.getcwd())+f"\\{project}\\{project}.shp")   
    shape = gpd.read_file(os.path.join(os.path.dirname(os.getcwd()), project, f"{project}.shp"))

    js = json.loads(shape.to_json())
    
    project_geom = f"{project}"
    globals()[project_geom]= ee.Geometry(ee.FeatureCollection(js).geometry())
    
    """Define the forested and non forested samples"""
    
    shape1 = gpd.read_file(os.path.dirname(os.getcwd())+f"\\{project}\\{project}_forest_shp.shp")
    js = json.loads(shape1.to_json())
    forest = ee.FeatureCollection(js)
    
    shape2 = gpd.read_file(os.path.dirname(os.getcwd())+f"\\{project}\\{project}_non_forest_shp.shp")
    js = json.loads(shape2.to_json())
    non_forest = ee.FeatureCollection(js)
    
    # Define the visualization parameters.
    vizParams = {
      'bands': ["vis-red", "vis-green", "vis-blue"],
      'min': 0,
      'max': 0.5,
      'gamma': [0.95, 1.1, 1]
    }
    
    
    ##Scaling and NDVI filters
    
    def applyScaleFactors(image):
      opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2)
      thermalBands = image.select('SR_B.').multiply(0.0034182).add(149)
      return image.addBands(opticalBands,None,True).addBands(thermalBands,None,True)
    
    def ndviLS(image):
      ndvi = image.normalizedDifference(['SR_B5','SR_B4']).rename('NDVI')
      return image.addBands(ndvi)
    
    ##LANDSAT
    
    landsat2015 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2').filterDate('2015-05-01','2015-08-30').filterBounds(globals()[project_geom]).filter(ee.Filter.lt('CLOUD_COVER',10)).aside(print).map(ndviLS).map(applyScaleFactors).median().clip(globals()[project_geom])
  
    bandsLandsat = ['SR_B2','SR_B3','SR_B4','SR_B5','NDVI']
    
    shape1 = gpd.read_file(os.path.dirname(os.getcwd())+f"\\{project}\\{project}_forest_shp.shp")
    js = json.loads(shape1.to_json())
    forest = ee.FeatureCollection(js)
    
    shape2 = gpd.read_file(os.path.dirname(os.getcwd())+f"\\{project}\\{project}_non_forest_shp.shp")
    js = json.loads(shape2.to_json())
    non_forest = ee.FeatureCollection(js)
    
    #sample created images from landsat image
    
    #non forest
    
    sampledNonForestLandsat = landsat2015.select(bandsLandsat).sampleRegions(**{
       'collection': non_forest, #region to sample over
       'properties': ['landcover'], #the list of properties to copy from each input feature
       'scale': 30 #resolution of the image in meters
    })
    
    #forest
    sampledForestLandsat = landsat2015.select(bandsLandsat).sampleRegions(**{
       'collection': forest, #region to sample over
       'properties': ['landcover'], #the list of properties to copy from each input feature
       'scale': 30 #resolution of the image in meters
    })
    
    
    #80/20 training/test split
    threshold = 0.8
    
    """Non Forest"""
    trainNonForestLandsat = sampledNonForestLandsat.randomColumn('random').filter(ee.Filter.lte('random',threshold))
    testNonForestLandsat = sampledNonForestLandsat.randomColumn('random').filter(ee.Filter.gt('random',threshold))
    
    
    """Forest"""
    trainForestLandsat = sampledForestLandsat.randomColumn('random').filter(ee.Filter.lte('random',threshold))
    testForestLandsat = sampledForestLandsat.randomColumn('random').filter(ee.Filter.gt('random',threshold))
    
    
    """Merge Forest and Non Forest"""
    trainLandsat = trainForestLandsat.merge(trainNonForestLandsat)
    testLandsat = testForestLandsat.merge(testNonForestLandsat)
    
    """Train the random forest classifier with the trained dataset, assigning the desired number of trees,
    specifying the class labels and input property
    """
    
    #model
    classifier2015 = ee.Classifier.smileRandomForest(10).train(**{ #10 trees cause we are working on a big area and want to be faster
      'features': trainLandsat,
      'classProperty': 'landcover',
      'inputProperties': bandsLandsat
    })
    
    """Get a confusion matrix and compute the accuracy of the model performance"""

    """Predicted values applied on landsat2015 population corresponding Test forest and non-forest samples"""

    testingLandsat = testLandsat.classify(classifier2015)
    
    testAccuracyLandsat = testingLandsat.errorMatrix('landcover','classification')

    
    classified2015= landsat2015.select(bandsLandsat).classify(classifier2015)
    
    """#External dataset (Optional)
    Load the satellite imagery (replace with your own image collection), then load, classify the external dataset, get confusion matrix to see missclassified labels, then compute accuracy and model test performance
    """
    
    imageCollection = ee.ImageCollection("projects/sat-io/open-datasets/landcover/ESRI_Global-LULC_10m_TS").mosaic().clip(landsat2015.geometry())
    
    
    refPoints_2015 = ee.FeatureCollection('users/vyordanov/Amazon/Amazon2015_refPoints').filterBounds(globals()[project_geom])
    

    def func_oqa(feat):
      return ee.Feature(feat.geometry(),{'landcover': feat.get('land_cover')})
    
    refPoints_2015 = refPoints_2015.map(func_oqa)
    
    sampleRefPointsLandsat2015 = classified2015.select('classification').sampleRegions(**{
      'collection': refPoints_2015,
      'properties': ['landcover'],
      'scale': 30
    })
    
    refAccuracyLandsat = sampleRefPointsLandsat2015.errorMatrix('landcover','classification')
    
    #print('Landsat External validation Accuracy: ', refAccuracyLandsat.accuracy())
    
    palette = [
      'red',#non forest
      'green' #forest
    ]
    

    ##SENTINEL2##
    
    from datetime import date
    
    print(str(date.today()))
    
    def ndviSE(image):
      ndvi = image.normalizedDifference(['B8','B4']).rename('NDVI')
      return image.addBands(ndvi)
    
    def maskS2cloud (image):
    
      qa = image.select('QA60'); #Use of QA60 band to mask clouds
    
      #bits 10: clouds bits 11: cirrus
      cloudBitMask = 1 << 10
      cirrusBitMask = 1 << 11
    
      #flags should be set to 0 indicating clear conditions
      mask = qa.bitwiseAnd(cloudBitMask).eq(0) \
                  .And(qa.bitwiseAnd(cirrusBitMask).eq(0))
    
      return image.updateMask(mask).divide(10000)
    
    sentinel2023 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
                .filterDate('2023-05-01', str(date.today())) \
                .filterBounds(globals()[project_geom]) \
                .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',10)) \
                .aside(print) \
                .map(maskS2cloud) \
                .map(ndviSE) \
                .median() \
                .clip(globals()[project_geom]);
    
    visParSentinel = {
      'min': 0.0,
      'max': 0.3,
      'bands': ['B4', 'B3', 'B2'],
    }
    

    bandSentinel = ['B2','B3','B4','B8','NDVI']
    
    #sample created images from landsat image
    
    #non forest
    
    sampledNonForestSentinel = sentinel2023.select(bandSentinel).sampleRegions(**{
       'collection': non_forest, #region to sample over
       'properties': ['landcover'], #the list of properties to copy from each input feature
       'scale': 30 #resolution of the image in meters
    })
    
    
    #80/20 training/test split
    threshold = 0.8
    
    trainNonForestSentinel = sampledNonForestSentinel.randomColumn('random').filter(ee.Filter.lte('random',threshold))
    testNonForestSentinel = sampledNonForestSentinel.randomColumn('random').filter(ee.Filter.gt('random',threshold))
    
    #forest
    sampledForestSentinel = sentinel2023.select(bandSentinel).sampleRegions(**{
       'collection': forest, #region to sample over
       'properties': ['landcover'], #the list of properties to copy from each input feature
       'scale': 30 #resolution of the image in meters
    })
    
    threshold = 0.8
    
    trainForestSentinel = sampledForestSentinel.randomColumn('random').filter(ee.Filter.lte('random',threshold))
    testForestSentinel = sampledForestSentinel.randomColumn('random').filter(ee.Filter.gt('random',threshold))
    
    trainSentinel = trainForestSentinel.merge(trainNonForestSentinel)
    testSentinel = testForestSentinel.merge(testNonForestSentinel)
    
    #train the random forest classifier with the trained dataset, assigning the desired number of trees,
    #specifying the class labels and input property
    
    #model
    classifier2023 = ee.Classifier.smileRandomForest(10).train(**{ #10 trees cause we are working on a big area and want to be faster
      'features': trainSentinel,
      'classProperty': 'landcover',
      'inputProperties': bandSentinel
    })
    


    #predicted values applied on landsat2015 population corresponding Test forest and non-forest samples
    testingSentinel= testSentinel.classify(classifier2023)
    
    testAccuracySentinel = testingSentinel.errorMatrix('landcover','classification')
    

    classified2023= sentinel2023.select(bandSentinel).classify(classifier2023)
    
    """# External dataset (Optional):
    Load the satellite imagery (replace with your own image collection), then load, classify the external dataset, get confusion matrix to see missclassified labels, then compute accuracy and model test performance
    """
    
    refPoints_2023 = ee.FeatureCollection('users/vyordanov/Amazon/Amazon2015_refPoints').filterBounds(globals()[project_geom])

    def func_dkj(feat):
      return ee.Feature(feat.geometry(),{'landcover': feat.get('land_cover')})
    
    refPoints_2023 = refPoints_2023.map(func_dkj)
    
    sampleRefPointsSentinel2023 = classified2023.select('classification').sampleRegions(**{
      'collection': refPoints_2023,
      'properties': ['landcover'],
      'scale': 30
    })
    
    refAccuracySentinel = sampleRefPointsSentinel2023.errorMatrix('landcover','classification')
  
    
    palette = [
      'red',#non forest
      'green' #forest
    ]
    

    
    """Application of morphological operator: cleaning noise by applying a smoothing mask in a neighboorhood of k=2"""
    
    classified2015clean = classified2015.focalMode(2)
    classified2023clean = classified2023.focalMode(2)
    
    #resample and match resolution, so as to match different scale of satellites used
    
    #turn 30m to 10m for landsat
    classified2015_10m = classified2015clean.resample('bicubic').reproject(**{
      'crs': 'EPSG:32721',
      'scale':10
    })
    
    #match with sentinel
    classified2023_10m = classified2023clean.reproject(**{
      'crs': 'EPSG:32721',
      'scale':10
    })
    
    now= str(datetime.now())
    
    assetId_2015 = f"{project}2015assetId"
    description_2015 = f"{project}2015description"
    assetId_2023 = f"{project}2023assetId"
    description_2023 = f"{project}2023description"

    globals()[assetId_2015] = str('projects/ee-blockchain/assets/classified2015_10m_'+now)[:68].replace(':','-').replace(' ','_')
    globals()[description_2015] = str('classified2015_10m_'+now)[:38].replace(':','-').replace(' ','_')
    globals()[assetId_2023] = str('projects/ee-blockchain/assets/classified2023_10m_'+now)[:68].replace(':','-').replace(' ','_')
    globals()[description_2023]= str('classified2023_10m_'+now)[:38].replace(':','-').replace(' ','_')
    
    
    print("Calculating end date Classification")
    task1 = ee.batch.Export.image.toAsset(**{
      "image": classified2023_10m,
      "description": globals()[description_2023],
      "assetId":globals()[assetId_2023],
      "scale":30,
      "crs": 'EPSG:32721',
      "region": globals()[project_geom],
      "maxPixels": 1e9,
    })
    
    task1.start()
    
    
    
    #time.sleep(1800)
    
    print("Calculating start date Classification")
    task2 = ee.batch.Export.image.toAsset(**{
      "image": classified2015_10m,
      "description": globals()[description_2015],
      "assetId":globals()[assetId_2015],
      "scale":30,
      "crs": 'EPSG:32721',
      "region": globals()[project_geom],
      "maxPixels": 1e9,
    })
    
    task2.start()
    
    while True:
        status1 = task1.status()
        state1 = status1['state']

        status2 = task2.status()
        state2 = status2['state']

        
        if state1 in ['COMPLETED', 'FAILED', 'CANCELLED'] and state2 in ['COMPLETED', 'FAILED', 'CANCELLED']:
            print(f"Task {task1} and {task2} status: {state1},{state2}")
            break

        time.sleep(60)
    
    #check_task_status(task1, interval=60)
    #check_task_status(task2, interval=60)

    
    #time.sleep(900)
   

    
    print("Image Classification complete")
    
    ee.Reset()
    ee.Initialize(credentials, project='ee-blockchain')
    
    classified2015_10m = ee.Image(globals()[assetId_2015])
    classified2023_10m = ee.Image(globals()[assetId_2023])
    
    

    """Compute the difference between two classification maps and add it as new layer, then net forest loss and gain"""
    
    diff = classified2015_10m.subtract(classified2023_10m)
    
    #Compute net forest loss and gain
    # 1 Forest- 0 non-forest = 1 Loss # 0 Non forest -1 forest =-1 Gain#
    
    #add the areas representing forest loss only, as a layer
    forest_loss=diff.updateMask(diff.eq(1))
    print("Calculation Forest Loss complete")

    
    #add the areas representing forest Gain only, as a layer
    forest_gain=diff.updateMask(diff.eq(-1))
    print("Calculation Forest Gain complete")

    
    #compute and print AOI in km2
    project_km2 = f"{project}km2"
    globals()[project_km2] = globals()[project_geom].area().divide(1000000)
    
    #compute and print the area of the forest loss and gain
    areaLoss = forest_loss.multiply(ee.Image.pixelArea().divide(1000000))
    
    
    statsLoss = areaLoss.reduceRegion(**{
      'reducer': ee.Reducer.sum(),
      'geometry': globals()[project_geom],
      'scale': 30,
      'maxPixels': 1e9, #previously 1e13
      'tileScale':16
    }).getNumber('classification')
    
    print("Calculation Area and Statistical Loss complete")
    

    areaGain = forest_gain.multiply(ee.Image.pixelArea().divide(-1000000))
    
    statsGain = areaGain.reduceRegion(**{
      'reducer': ee.Reducer.sum(),
      'geometry': globals()[project_geom],
      'scale': 30,#10,
      'maxPixels': 1e9,#1e10, #previously 1e13
      'tileScale':16
    }).getNumber('classification')
    
    print("Calculation Area and Statistical Gain complete")
    

    
    """
    Finally, compute and print the relative area of the foreset loss and forest gain
    in relation to total area of AOI"""
    
    relLoss = statsLoss.divide(globals()[project_km2])
    relLossinfo = relLoss.getInfo()*100
    print("Calculation of Real Loss complete")

    time.sleep(100)

    
    relGain = statsGain.divide(globals()[project_km2])
    relGaininfo = relGain.getInfo()*100
    
    print("Calculation of Real Gain complete")

    net = relLossinfo - relGaininfo
    
    print("Calculation Net Result Complete complete")
    
    data= {'Net_Change':net, 'Area_Loss':areaLoss.getInfo(),'Area_Gain':areaGain.getInfo(), 'Statistical_Loss':statsLoss.getInfo(),'Statistical_Gain':statsGain.getInfo(),'Realative_Loss':relLoss.getInfo(),'Realtive_Gain':relGain.getInfo()}
    
    with open(os.path.dirname(os.getcwd())+'\\toipfs\\data.txt', 'w') as file:
         file.write(json.dumps(data)) # use `json.loads` to do the reverse
    
    print("Data Saved to Disk")       
    
    
    #### DOWNLOAD LOCAL COPIES/ IPFS####
    # Export images to local folder
    landsat = os.path.join(os.path.dirname(os.getcwd())+'\\toipfs\\', 'landsat.tif')
    sentinel = os.path.join(os.path.dirname(os.getcwd())+'\\toipfs\\', 'sentinel.tif')
    
    geemap.ee_export_image(classified2023_10m.visualize(**{'min':0,'max':1,'palette': palette}), filename=landsat, scale=90, region=globals()[project_geom], file_per_band=False)
    geemap.ee_export_image(classified2015_10m.visualize(**{'min':0,'max':1,'palette': palette}), filename=sentinel, scale=100, region=globals()[project_geom], file_per_band=False)
    
    
    
    # Export images to drive 
    ee.batch.Export.image.toDrive(**{
      "image": classified2015_10m,
      "description": 'classified2015_10m',
      "scale":10,
      "crs": 'EPSG:32721',
      "region": globals()[project_geom],
      "maxPixels": 1e13,
      "folder": "gee-images"
    }).start()
    
    ee.batch.Export.image.toDrive(**{
      "image": classified2023_10m,
      "description": 'classified2023_10m',
      "scale":10,
      "crs": 'EPSG:32721',
      "region": globals()[project_geom],
      "maxPixels": 1e13,
      "folder": "gee-images"
    }).start()
    

    
    today = str(date.today().strftime("%d/%m/%Y"))
    output_filename  = str(f"{project}_"+ today).replace('/','_')
    
    os.chdir(os.path.dirname(os.getcwd())+'\\toipfs\\')
    
    save_python_file(file_contents, 'current_script_version.py')
    get_latest_commit_id()
    
    shutil.make_archive(output_filename, 'zip')
    
    
    pinata = output_filename+'.zip'
    
    #Add project reference as well
    totable = [[net, today, upload_ipfs_pinata(pinata),f"{project}"]]
    
    print("Data Uploaded to IPFS")     
    
    totable = pd.DataFrame(totable, columns=['Rate_of_Deforestation','Time','File_Hash','Project']) 
    
    
    delete_files(os.getcwd())
    
    os.chdir(os.path.dirname(os.getcwd()))
    
    
    try:
        pd_to_sqlDB(totable,table_name='Deforestation_Rate',db_name='defrate.db')
    except:
        row_to_sql(totable, table_name='Deforestation_Rate',db_name='defrate.db')
    
    print("Deforestation metadata Data Uploaded to SQL")     
    

    
    # Step 3: Write the SQL query in a string variable
    sql_query_string = """
        SELECT * FROM Deforestation_Rate
    
    """
    
    # Step 4: Exectue the SQL query
    result_df = sql_query_to_pd(sql_query_string, db_name='defrate.db')
    result_df
    
    
    # Step 5: Check time duplicates
    n_rows=len(result_df)
    
    if n_rows>1:
      timecheck = result_df.iloc[n_rows-1,1]== result_df.iloc[n_rows-2,1]
    
      if timecheck==True:
          remove_last_sql(table_name='Deforestation_Rate',db_name='defrate.db')
          print("SQL Table Duplicate Removed")
      else:
          print("SQL Table Unique Values Ensured")

    return data