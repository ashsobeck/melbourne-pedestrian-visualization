#!/usr/bin/env python3

import pandas as pd

#data1 = pd.read_csv('../data/nov_2019.csv')
data1 = pd.read_csv('/Users/richardgarcia/Documents/GitHub/melbourne-pedestrian-visualization/data/nov_2019.csv')

#data2 = pd.read_csv('../data/sensor_locations.csv')
data2 = pd.read_csv('/Users/richardgarcia/Documents/GitHub/melbourne-pedestrian-visualization/data/sensor_locations.csv')

output = pd.merge(data1, data2, on='sensor_id', how='left')

#cleans up the date_time column elminating time
output['date_time'] = [x[:-13] for x in output['date_time']]


#print(output) 
output.to_csv('/Users/richardgarcia/Documents/GitHub/melbourne-pedestrian-visualization/data/joined_data.csv')