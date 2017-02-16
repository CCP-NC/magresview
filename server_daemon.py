import json
from flask import Flask
from flask_cors import CORS, cross_origin
from pymongo import MongoClient

# MAGRES database
client = MongoClient(host='wigner.esc.rl.ac.uk')
ccpnc = client.ccpnc

# Flask App
app = Flask(__name__)
cors = CORS(app)

@app.route("/magresquery/<int:query_id>")
def magresquery(query_id):
    ff = ccpnc.magresData.find({"icsdID": query_id})
    # Get the first magres file in the query
    f = next(ff)
    fileID = f['magresFilesID']
    magres = next(ccpnc.magresFiles.find({'_id': fileID}))

    magres_html = magres['magres']
    magres_html.replace('\n', '<br>')
    return magres_html


@app.route("/magresquery/minms<float:minms>/maxms<float:maxms>")
def minmaxquery(minms, maxms):
    print minms, maxms
    return "Nothing"


if __name__ == "__main__":

    app.run()
