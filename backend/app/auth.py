from fastapi import Header, HTTPException
import os

ADMIN_TOKEN = os.getenv("ADMIN_TOKEN")

def admin_required(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    token = authorization.split(" ")[1]
    if token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")