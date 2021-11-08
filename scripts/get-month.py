#!/usr/bin/env python3
import pandas as pd

data_2019 = pd.read_csv('../data/2019_pedestrian.csv')
df = pd.DataFrame(data=data_2019)
subset = df[df.month == "November"]

subset.to_csv('../data/nov_2019.csv')
