#!/usr/bin/env python

from sodapy import Socrata
import pandas as pd
from dotenv import load_dotenv
import os

load_dotenv('../secrets.env')

APP_TOKEN=os.getenv('AppToken')

client = Socrata("data.melbourne.vic.gov.au", APP_TOKEN)

results = client.get("b2ak-trbp", where="month = 'November' and year = '2020'", limit=200)
df = pd.DataFrame.from_records(results)
df.to_csv('../data/nov_2020.csv')
