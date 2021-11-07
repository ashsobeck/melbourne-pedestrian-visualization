#!/usr/bin/env python3

import pandas as pd

#data1 = pd.read_csv('../data/nov_2019.csv')
data1 = pd.read_csv('/Users/Richard Garcia/OneDrive - Clemson University/Documents/GitHub/melbourne-pedestrian-visualization/data/extreme_weather_Nov_21_2016.csv')

#data2 = pd.read_csv('../data/sensor_locations.csv')
data2 = pd.read_csv('/Users/Richard Garcia/OneDrive - Clemson University/Documents/GitHub/melbourne-pedestrian-visualization/data/sensor_locations.csv')

output = pd.merge(data1, data2, on='sensor_id', how='left')

#cleans up the date_time column elminating time
output['date_time'] = output['date_time'].str[:10]

#print(output) 
output.to_csv("/Users/Richard Garcia/OneDrive - Clemson University/Desktop/4030/Nov_21_2016_extreme_weather.csv")

# "C:\Users\Richard Garcia\OneDrive - Clemson University\Desktop\4030"