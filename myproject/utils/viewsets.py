# -*- coding: utf-8 -*-
"""
Created on Sun Jun 16 17:57:06 2024

@author: cdaou
"""

from rest_framework import routers, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from utils.utils_sat import four_months_before
from utils.satellite_analysis import satellite_analysis, satellite_analysis_aoi
from datetime import datetime

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage

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
from django.http import JsonResponse



import folium
from utils.utils_sat import four_months_before, read_python_file, save_file, get_latest_commit_id, delete_files, kml2shape, eight_months_before,check_task_status, geelogin, deploy_smartcontract, transfercarbon, deforestation_analysis
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

# Initialize logging
logger = logging.getLogger(__name__)






class CalculateFourMonthsBeforeViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'])
    def calculate(self, request):
        date = request.data.get('date')
        date = str(datetime.strptime(date, '%Y-%m-%dT%H:%M:%S.%fZ'))[:10]
        calculation = four_months_before(date)  # Assuming four_months_before is imported
        return Response({'Calculated date 4 months before': calculation})


# Focus on viewsets.py not views.py, for REST APIs
class CalculateDeforestationRateProjectViewSet(viewsets.ViewSet):
    @method_decorator(csrf_exempt)
    @action(detail=False, methods=['post'])
    def calculate(self, request):
        project = request.data.get('project')
        logger.debug(f"Received project data: {project}")
        if not project:
            logger.error("Missing project parameter")
            return Response({'error': 'Missing project'}, status=status.HTTP_400_BAD_REQUEST)

         # Call the satellite_analysis function and get the result
        result = satellite_analysis(project)

        response_data = {
	    'Project': result[0],
            'Date & Time': result[1],
            'Net Deforestation Rate': result[2],
            'Statistical Loss': result[3] ,
            'Statistical Gain': result[4] ,
	    'IPFS CID': result[5]
        }

        return Response(response_data)


class CalculateDeforestationRateAoiViewSet(viewsets.ViewSet):

    @method_decorator(csrf_exempt)
    @action(detail=False, methods=['post'])

    def calculate(self, request):

        project = request.FILES.get('project')
        logger.debug(f"Received KML file: {project}")

        if not project:
            logger.error("Missing project parameter")
            return Response({'error': 'No KML file provided'}, status=status.HTTP_400_BAD_REQUEST)



        file_path = default_storage.save(f'satellite_data/kml/{project}', ContentFile(project.read()))


         # Call the satellite_analysis function and get the result
        result = satellite_analysis_aoi(file_path)

        response_data = {
	    'Project': result[0],
            'Date & Time': result[1],
            'Net Deforestation Rate': result[2],
            'Statistical Loss': result[3] ,
            'Statistical Gain': result[4] ,
	    'IPFS CID': result[5]
        }

        return Response(response_data)



# Register the ViewSets with a router
router = routers.SimpleRouter()
router.register(r'calculate_four_months_before', CalculateFourMonthsBeforeViewSet, basename="calculate_four_months_before")
router.register(r'calculate_deforestation_rate_project', CalculateDeforestationRateProjectViewSet, basename="calculate_deforestation_rate_project")
router.register(r'calculate_deforestation_rate_aoi', CalculateDeforestationRateAoiViewSet, basename="calculate_deforestation_rate_aoi")


# Define the urlpatterns for the router
urlpatterns = router.urls
