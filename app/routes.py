from flask import render_template
from app import app, socketio
from flask.ext.socketio import send, emit


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
ids = df_sub.id.values
df_sub = df_sub.drop(['latitude', 'longitude', 'id'], axis = 1)

imp = preprocessing.Imputer(axis=0)
X = imp.fit_transform(df_sub)
X_centered = preprocessing.scale(X)
clt = KMeans(n_clusters = 8)


@socketio.on('my event')
def handle_message(message):
    print message['data']

@socketio.on('cluster')
def handle_message(message):

	cols = list(message['data'])
	inds = []
	for col in cols:
		inds.append(df_sub.columns.get_loc(col))
	
	X_changed = X_centered.copy()
	for i in inds:
		X_changed[:,i] *= 1000

	clt = KMeans(n_clusters = 8)
	clusters = clt.fit_predict(X_changed)

	map_data = dict(zip(ids.tolist(), clusters.tolist()))

	emit('new clusters',  map_data)


@app.route('/')
def index():

	clusters = clt.fit_predict(X_centered)

	data = pd.DataFrame({'id': ids,'cluster': clusters})
	map_data = dict(zip(ids.tolist(), clusters.tolist()))
	return render_template('home.html', data=['transit_score', 'nightlife', 'violent' ,'Affordability Data: Median List Price Per Sq Ft'], map_data = map_data)

