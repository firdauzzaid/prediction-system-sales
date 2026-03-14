from datetime import datetime, timedelta
from typing import Optional, Dict
from jose import JWTError, jwt
from app.core.config import settings

def create_access_token(data: Dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None

def authenticate_user(username: str, password: str):
    # Dummy authentication
    if username == settings.DUMMY_USERNAME and password == settings.DUMMY_PASSWORD:
        return {"sub": username, "role": "admin"}
    return None