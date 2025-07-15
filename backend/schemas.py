from pydantic import BaseModel
from typing import List, Optional

class UserCreate(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: Optional[str]
    username: str
    friends: List[str] = []
    games: List[str] = []
    tribes: List[str] = []

class Game(BaseModel):
    id: Optional[str]
    name: str

class Tribe(BaseModel):
    id: Optional[str]
    name: str
