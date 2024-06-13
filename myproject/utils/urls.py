from django.urls import path
from . import views

urlpatterns = [
     path("", views.members, name='members'),
     path("", views.satellite_analysis, name='satellite_analysis'),
    path('api/calculate_four_months_before/calculate/', views.satellite_analysis, name='calculate_deforestation_rate'),



]
