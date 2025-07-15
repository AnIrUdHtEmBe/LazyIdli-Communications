from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from database import get_database
from schemas import UserCreate, User
from pydantic import BaseModel

class FriendData(BaseModel):
    name: str
    message: str
    count: int
    time: str

app = FastAPI()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

@app.get("/")
async def root():
    return {"message": "Hello World"}

async def get_current_username(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return username
    except JWTError:
        raise credentials_exception

@app.post("/register")
async def register(user: UserCreate):
    db = get_database()
    existing = await db.users.find_one({"username": user.username})
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_pw = pwd_context.hash(user.password)
    user_doc = {"username": user.username, "hashed_password": hashed_pw, "friends": []}
    await db.users.insert_one(user_doc)
    return {"msg": "User created"}

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db = get_database()
    user = await db.users.find_one({"username": form_data.username})
    if not user or not pwd_context.verify(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode({"sub": user["username"]}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}


@app.post("/addFriends")
async def add_friends(friend: FriendData, username: str = Depends(get_current_username)):
    db = get_database()
    
    # Find the user document
    user = await db.users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prepare friend entry with additional fields
    friend_entry = {
        "name": friend.name,
        "message": friend.message,
        "count": friend.count,
        "time": friend.time
    }
    
    # Add friend to user's friends list (avoid duplicates)
    existing_friends = user.get("friends", [])
    if any(f["name"] == friend.name for f in existing_friends):
        raise HTTPException(status_code=400, detail="Friend already added")
    
    existing_friends.append(friend_entry)
    
    # Update user document
    await db.users.update_one(
        {"username": username},
        {"$set": {"friends": existing_friends}}
    )
    
    return {"message": f"Friend {friend.name} added successfully"}
