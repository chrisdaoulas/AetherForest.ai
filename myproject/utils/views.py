# -*- coding: utf-8 -*-
"""
Created on Fri Jun 14 12:58:54 2024

@author: cdaou
"""

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
from utils.satellite_analysis import satellite_analysis
import shutil


import json
import fiona
import geopandas as gpd
import os

from django.views.decorators.csrf import csrf_exempt
import json
import logging



# Configure logging
logging.basicConfig(level=logging.DEBUG)


def members(request):
    return HttpResponse("Hello world!")


def calculate_four_months_before(request):
    if request.method == 'POST':
        date = request.POST.get('date')
        calculation = four_months_before(date)
        return JsonResponse({'Calculated date 4 months before': calculation})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=400)



@csrf_exempt
def satellite_analysis(request):
    if request.method == 'POST':
        try:
            project = request.POST.get('project')
            # kml_file = request.FILES['kmlFile']


            logging.debug(f"Received project: {project}")

            if not project:
                return JsonResponse({'error': 'Missing project'}, status=400)

            data = satellite_analysis(project)       
       
            return JsonResponse({'Deforestation Rate': data})
       
        except Exception as e:
          return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


