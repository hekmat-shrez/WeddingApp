from pymongo import MongoClient

client = MongoClient("mongodb+srv://yasinhaji20:t6Br5jLsN7udQAWk@cluster0.7vw4o.mongodb.net/wedwise?retryWrites=true&w=majority&appName=Cluster0")

db = client['wedwise']
users = db.users.find()

print(">>> Users in MongoDB:")
for user in users:
    print(user)
