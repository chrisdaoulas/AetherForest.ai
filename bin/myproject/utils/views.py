from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from utils.utils_sat import four_months_before

def members(request):
    return HttpResponse("Hello world!")


def calculate_four_months_before(request):
    if request.method == 'POST':
        date = request.POST.get('date')
        calculation = four_months_before(date)
        return JsonResponse({'Calculated date 4 months before': calculation})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=400)