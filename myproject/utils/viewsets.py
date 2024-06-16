from rest_framework import routers, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from utils.utils_sat import four_months_before
from utils.satellite_analysis import satellite_analysis
from datetime import datetime

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse


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
class CalculateDeforestationRateViewSet(viewsets.ViewSet):
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
            'Net Deforestation Rate': result[1],
            'Statistical Loss': result[2] ,
            'Statistical Gain': result[3] ,
	    'IPFS CID': result[4]
        }

        return Response(response_data)





# Register the ViewSets with a router
router = routers.SimpleRouter()
router.register(r'calculate_four_months_before', CalculateFourMonthsBeforeViewSet, basename="calculate_four_months_before")
router.register(r'calculate_deforestation_rate', CalculateDeforestationRateViewSet, basename="calculate_deforestation_rate")


# Define the urlpatterns for the router
urlpatterns = router.urls
