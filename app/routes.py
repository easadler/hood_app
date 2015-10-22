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

df = pd.read_csv('app/static/csv/final_1.csv')

ids = df.hood.values
names = df.hood
#df.drop(['id'], axis = 1, inplace = True)
mask = (df.dtypes == np.float64) | (df.dtypes == np.int)
df_sub = df.ix[:, mask]

columns = df_sub.columns.values


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
	X_changed = X_centered.copy()

	inds = []
	for col in cols:
		inds.append(df_sub.columns.get_loc(col))
	
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
	print map_data
	return render_template('home.html', data= columns, map_data = map_data)

