# -*- coding: utf-8 -*-
"""
Created on Wed May 22 19:37:31 2024

@author: cdaou
"""

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

os.chdir("C:\\Users\\cdaou\\OneDrive\\Documents\\MSBDGA\\Github\\AmazoniaCoin\\satellite_data\\scripts")
#os.chdir(os.getcwd()+'\\satellite_data\\scripts')

import folium
from utils_sat import *
from SQL_database import *
from IPFS import *
import shutil


import json
import fiona
import geopandas as gpd
import os

geelogin()

project = 'Kayapo'
EE_TILES = 'https://earthengine.googleapis.com/map/{mapid}/{{z}}/{{x}}/{{y}}?token={token}'


#shape = gpd.read_file(os.path.dirname(os.getcwd())+f"\\{project}\\{project}.shp")   
shape = gpd.read_file(os.path.join(os.path.dirname(os.getcwd()), project, f"{project}.shp"))

js = json.loads(shape.to_json())

project_geom = f"{project}"
globals()[project_geom]= ee.Geometry(ee.FeatureCollection(js).geometry())

classified2023_10m = ee.Image("projects/ee-blockchain/assets/classified2023_10m_2024-05-24_13-58-48")
classified2015_10m = ee.Image("projects/ee-blockchain/assets/classified2015_10m_2024-05-24_13-58-48")




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
  'scale': 10,
  'maxPixels': 1e10, #previously 1e13
  'tileScale':16
}).getNumber('classification')

relLoss = statsLoss.divide(globals()[project_km2])

print("Calculation Area and Statistical Loss complete")


areaGain = forest_gain.multiply(ee.Image.pixelArea().divide(-1000000))

statsGain = areaGain.reduceRegion(**{
  'reducer': ee.Reducer.sum(),
  'geometry': globals()[project_geom],
  'scale': 10,
  'maxPixels': 1e10, #previously 1e13
  'tileScale':16
}).getNumber('classification')


relGain = statsGain.divide(globals()[project_km2])


results = [areaLoss, areaGain, statsLoss, statsGain , relLoss, relGain]
print("Calculation Area and Statistical Gain complete")

relLossinfo = relLoss.getInfo()*100
print("Calculation of Real Loss complete")

time.sleep(100)

geelogin()


relGaininfo = relGain.getInfo()*100
print("Calculation of Real Gain complete")

net = relLossinfo - relGaininfo



def kml2shape(kml):
    
    fiona.drvsupport.supported_drivers['KML'] = 'rw'
    os.chdir("C:\\Users\\cdaou\\OneDrive\\Documents\\MSBDGA\\Github\\AmazoniaCoin\\myproject\\satellite_data\\kml\\")
    
    kml = kml[19:]        
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