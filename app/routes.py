from flask import render_template
from app import app, socketio
from flask.ext.socketio import send, emit
from scipy.spatial.distance import euclidean

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
df = df.fillna(0)
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
	cols = list(message['data'].keys())
	
	x = message['data']

	df_cos = df_sub[cols].append(x, ignore_index = True)


	X = df_cos.values

	user_array = X[-1]
	hood_matrix = X[:-1]

	max_array = hood_matrix.max(axis = 1)
	min_array = hood_matrix.min(axis = 1)

	def translate(user_value, col_min, col_max):
		NewRange = col_max - col_min
		return (((user_value - (-1)) * NewRange) / 2) + col_min	

	user_array = [translate(x,y,z) for x,y,z in zip(user_array,min_array, max_array)]

	if len(cols) == 1:
		cs_array = np.apply_along_axis(lambda x: abs(x[0] - user_array[0]), 1, hood_matrix)
	else:
		cs_array = np.apply_along_axis(lambda x: euclidean(x, user_array), 1, hood_matrix)

	print cs_array
	max_val, min_val = max(cs_array), min(cs_array)
	color_values = np.linspace(min_val, max_val, 10)

	map_data = dict(zip(ids, cs_array))
	emit('new clusters',  map_data, color_values.tolist())


@app.route('/')
def index():

	# clusters = clt.fit_predict(X_centered)

	# data = pd.DataFrame({'id': ids,'cluster': clusters})
	# map_data = dict(zip(ids.tolist(), clusters.tolist()))
	
	map_data = dict(zip(ids.tolist(), [0]*len(ids)))

	

	return render_template('home.html', data= columns, map_data = map_data)

