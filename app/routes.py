from flask import render_template
from app import app, socketio



# data science
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import ast
import re

from sklearn.decomposition import PCA
from sklearn import preprocessing
from sklearn.cluster import KMeans

df = pd.read_csv('app/static/csv/final.csv')

mask = (df.dtypes == np.float64) | (df.dtypes == np.int)
df_sub = df.ix[:, mask]
df_sub = df_sub.fillna(0)
df_sub = df_sub.dropna(axis = 1, thresh = 10)
ids = df_sub.id
df_sub = df_sub.drop(['latitude', 'longitude', 'id'], axis = 1)

imp = preprocessing.Imputer(axis=0)

X = imp.fit_transform(df_sub)
X_centered = preprocessing.scale(X)
clt = KMeans(n_clusters = 8)
clusters = clt.fit_predict(X_centered)

data = pd.DataFrame({'id': ids,'cluster': clusters})
data.to_csv('app/static/csv/clusters.csv', index = False)

@socketio.on('my event')
def handle_message(message):
    print message['data']

@socketio.on('cluster')
def handle_message(message):
    print message['data']

    
@app.route('/')
def index():


	return render_template('home.html', data=['transit_score', 'nightlife', 'violent' ,'Affordability Data: Median List Price Per Sq Ft'])

