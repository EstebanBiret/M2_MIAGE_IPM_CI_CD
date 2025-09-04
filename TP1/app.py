from flask import Flask
from pymongo import MongoClient

app = Flask(__name__)

#connect to MongoDB
client = MongoClient("mongodb://mongo:27017/")
db = client["testdb"]
collection = db["messages"]

@app.route('/')
def hello_world():

    #add a message to the database and count total messages (increment at each launch)
    collection.insert_one({"message": "Hello World!"})
    count = collection.count_documents({})
    return f"Hello World! (nombre de messages en base: {count})"

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)