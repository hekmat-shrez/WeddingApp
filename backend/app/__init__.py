from flask import Flask
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os
import sys

load_dotenv()

app = Flask(__name__)

mongo_uri = os.getenv("MONGO_URI")
if "<db_password>" in mongo_uri:
    print("ERROR: You need to replace <db_password> with your actual MongoDB password in .env file")
    sys.exit(1)

app.config["MONGO_URI"] = mongo_uri
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

try:
    mongo = PyMongo(app)
    mongo.db.command('ping')
    print("Successfully connected to MongoDB.")
except Exception as e:
    print(f"ERROR connecting to MongoDB: {e}")
    print("Check your MONGO_URI in the .env file and make sure your IP is whitelisted in MongoDB Atlas.")
    sys.exit(1)

from app.routes import *