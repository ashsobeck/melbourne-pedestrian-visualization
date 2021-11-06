#!/usr/bin/env python3

import pandas as pd

#data1 = pd.read_csv('../data/nov_2019.csv')
data1 = pd.read_csv('/Users/Richard Garcia/OneDrive - Clemson University/Documents/GitHub/melbourne-pedestrian-visualization/data/full_2019_pedestrian.csv')

#data2 = pd.read_csv('../data/sensor_locations.csv')
data2 = pd.read_csv('/Users/Richard Garcia/OneDrive - Clemson University/Documents/GitHub/melbourne-pedestrian-visualization/data/sensor_locations.csv')

output = pd.merge(data1, data2, on='sensor_id', how='left')

#cleans up the date_time column elminating time
output['Date_Time'] = [x[:-13] for x in output['Date_Time']]


#print(output) 
output.to_csv("/Users/Richard Garcia/OneDrive - Clemson University/Desktop/4030/2019_pedestrian.csv")

# "C:\Users\Richard Garcia\OneDrive - Clemson University\Desktop\4030"