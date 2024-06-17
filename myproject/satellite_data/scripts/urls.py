# -*- coding: utf-8 -*-
"""
Created on Tue Apr 23 11:11:30 2024

@author: cdaou
"""

from django.urls import path
import views

urlpatterns = [
    path('api/calculate_four_months_before/', views.calculate_four_months_before, name='calculate_four_months_before'),
]