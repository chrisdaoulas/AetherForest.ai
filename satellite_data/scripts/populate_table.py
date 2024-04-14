# -*- coding: utf-8 -*-
"""
Created on Sun Apr 14 14:18:02 2024

@author: cdaou
"""
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime, timedelta
import pandas as pd

def concave_plot(start_date, end_date, start_float, end_float, num_points):
    # Calculate the time difference between start and end dates
    time_diff = (end_date - start_date).days

    # Generate equally spaced time intervals
    time_intervals = np.linspace(0, 1, num_points)

    # Calculate the dates for the specified number of points
    dates = [start_date + timedelta(days=int(time_diff * t)) for t in time_intervals]

    # Calculate weights for concave plot with diminishing returns
    weights = 1 / (1 + np.exp(-np.linspace(-5, 5, num_points)))

    # Interpolate floats using weighted averages
    interpolated_floats = start_float * (1 - weights) + end_float * weights
    
    # Create a DataFrame with dates and interpolated floats
    df = pd.DataFrame({'Date': dates, 'Float': interpolated_floats})

    
    plt.plot(dates, interpolated_floats, marker='o', linestyle='-')
    plt.xlabel('Time')
    plt.ylabel('Float Value')
    plt.title('Concave Plot with Diminishing Returns')
    plt.grid(True)
    plt.show()

    # Return list of (time, float) tuples
    return df

# Example usage:
start_date = datetime(2015, 1, 1)
end_date = datetime(2024, 1, 10)
start_float = 5.5
end_float = 13.45
num_points = 100

result = concave_plot(start_date, end_date, start_float, end_float, num_points)
for point in result:
    print(point)

df = result