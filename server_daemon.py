import json
from flask import Flask
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from bson.objectid import ObjectId

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
    return fileIDquery(fileID)


@app.route("/magresquery/minms<float:minms>/maxms<float:maxms>/sp<sp>")
def minmaxquery(minms, maxms, sp):

    ff = ccpnc.magresData.find({"$and": [
        {"values": {"$elemMatch": {"species": sp}}},
        {"values": {"$elemMatch":
                    {"$nor": [{"iso": {"$lt": minms}},
                              {"iso": {"$gt": maxms}}]}
                    }
         }
    ]})

    text = ""
    for f in ff:
        text += str(f)
        text += '<br><br>MagresFileID: <b>{0}</b>'.format(f['magresFilesID'])
        text += '<br><br> ----- <br><br>'
    return text


@app.route("/magresquery/fileID-<fileID>")
def fileIDquery(fileID):
    magres = next(ccpnc.magresFiles.find({'_id': ObjectId(fileID)}))
    magres_html = magres['magres']
    magres_html.replace('\n', '<br>')
    return magres_html


if __name__ == "__main__":

    app.run()
