# -*- coding: utf-8 -*-
"""
Created on Tue Apr 23 11:05:35 2024

@author: cdaou
"""


from django.http import JsonResponse
from utils_sat import four_months_before
import os

os.chdir("C:\\Users\\cdaou\\OneDrive\\Documents\\MSBDGA\\Github\\AmazoniaCoin\\satellite_data\\scripts")

def calculate_four_months_before(request,date):
    if request.method == 'POST':
        date = request.POST.get(date)
        calculation = four_months_before(date)
        return JsonResponse({'Calculated date 4 months before': calculation})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)