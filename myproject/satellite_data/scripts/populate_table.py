# -*- coding: utf-8 -*-
"""
Created on Sun Apr 14 14:18:02 2024

@author: cdaou
"""
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime, timedelta
import pandas as pd

import os
os.chdir('C:\\Users\\cdaou\\OneDrive\\Documents\\MSBDGA\\Github\\AmazoniaCoin\\satellite_data\\scripts')


from SQL_database import *

#Concave plot diminishing returns
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
df

os.chdir(os.path.dirname(os.getcwd()))



def add_df_to_sql(df,project: str):
    
    count = 1
    
    for time, net in zip(df.iloc[:, 0], df.iloc[:, 1]):
        
        print(count, time, net)
        
        #time = str(df.iloc[:count,0][count-1])
        #net = df.iloc[:count,1][count-1]
        #Add project reference as well
        time = str(time)[:10]
        totable = [[net, time, 'QmVnpqys6yucqAAg7Scrof3VAvETPeq3tLQ5mmjWRNAf'+str(count),project]]
    
        totable = pd.DataFrame(totable, columns=['Rate_of_Deforestation','Time','File_Hash','Project']) 
           
        try:
            pd_to_sqlDB(totable,table_name='Deforestation_Rate',db_name='defrate.db')
        except:
            row_to_sql(totable, table_name='Deforestation_Rate',db_name='defrate.db')
        
        count+=1
    



def exp_decay_concave_plot(start_date, end_date, start_float, end_float, num_points):
    # Calculate the time difference between start and end dates
    time_diff = (end_date - start_date).days

    # Generate equally spaced time intervals
    time_intervals = np.linspace(0, 1, num_points)

    # Calculate the dates for the specified number of points
    dates = [start_date + timedelta(days=int(time_diff * t)) for t in time_intervals]

    # Calculate the rate parameter for exponential decay
    rate_param = -5 * np.log(end_float / start_float) / time_diff

    # Calculate interpolated floats with exponential decay
    interpolated_floats = start_float * np.exp(-rate_param * np.linspace(0, time_diff, num_points))
    
    # Create a DataFrame with dates and interpolated floats
    df = pd.DataFrame({'Date': dates, 'Float': interpolated_floats})

    # Plot the concave plot
    plt.plot(dates, interpolated_floats, marker='o', linestyle='-')
    plt.xlabel('Date')
    plt.ylabel('Float Value')
    plt.title('Concave Plot with Exponential Decay')
    plt.grid(True)
    plt.show()
    
    return df

start_date = datetime(2015, 1, 1)
end_date = datetime(2024, 1, 10)
start_float = 6.5 
end_float = 2.5
num_points = 100

lf = exp_decay_concave_plot(start_date, end_date, start_float, end_float, num_points)
lf

add_df_to_sql(lf,'Yanomami')