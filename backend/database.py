import motor.motor_asyncio
from fastapi import FastAPI

MONGODB_URI = "mongodb+srv://anirudhat797:T2FIbH8wKGAvopPU@cluster0.vmpfl.mongodb.net/"

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
db = client.AblyChat

def get_database():
    return db
