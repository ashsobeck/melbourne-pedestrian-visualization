#!/usr/bin/env python3

import pandas as pd

data1 = pd.read_csv('../data/nov_2019.csv')
data2 = pd.read_csv('../data/sensor_locations.csv')

output = pd.merge(data1, data2, on='sensor_id', how='left')

print(output) 
output.to_csv('../data/joined_data.csv')