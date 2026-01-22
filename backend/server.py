from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import random
import string


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class VehicleInfo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    brand: str
    model: str
    year: str
    engine: str
    vin: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class VehicleInfoCreate(BaseModel):
    brand: str
    model: str
    year: str
    engine: str
    vin: Optional[str] = None

class OBDSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    vehicle_id: str
    rpm: int
    speed: int
    engine_load: float
    coolant_temp: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class OBDSessionCreate(BaseModel):
    vehicle_id: str
    rpm: int
    speed: int
    engine_load: float
    coolant_temp: int

class DTCCode(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    vehicle_id: str
    code: str
    description: str
    turkish_description: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class DTCCodeCreate(BaseModel):
    vehicle_id: str
    code: str
    description: str
    turkish_description: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "OBD-II Diagnostics API"}

# Vehicle Routes
@api_router.post("/vehicles", response_model=VehicleInfo)
async def create_vehicle(vehicle: VehicleInfoCreate):
    vehicle_dict = vehicle.dict()
    vehicle_obj = VehicleInfo(**vehicle_dict)
    await db.vehicles.insert_one(vehicle_obj.dict())
    return vehicle_obj

@api_router.get("/vehicles", response_model=List[VehicleInfo])
async def get_vehicles():
    vehicles = await db.vehicles.find().sort("created_at", -1).to_list(100)
    return [VehicleInfo(**vehicle) for vehicle in vehicles]

@api_router.get("/vehicles/{vehicle_id}", response_model=VehicleInfo)
async def get_vehicle(vehicle_id: str):
    vehicle = await db.vehicles.find_one({"id": vehicle_id})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return VehicleInfo(**vehicle)

# OBD Session Routes
@api_router.post("/obd-sessions", response_model=OBDSession)
async def create_obd_session(session: OBDSessionCreate):
    session_dict = session.dict()
    session_obj = OBDSession(**session_dict)
    await db.obd_sessions.insert_one(session_obj.dict())
    return session_obj

@api_router.get("/obd-sessions/{vehicle_id}", response_model=List[OBDSession])
async def get_obd_sessions(vehicle_id: str):
    sessions = await db.obd_sessions.find({"vehicle_id": vehicle_id}).sort("timestamp", -1).to_list(100)
    return [OBDSession(**session) for session in sessions]

# DTC Routes
@api_router.post("/dtc-codes", response_model=DTCCode)
async def create_dtc_code(dtc: DTCCodeCreate):
    dtc_dict = dtc.dict()
    dtc_obj = DTCCode(**dtc_dict)
    await db.dtc_codes.insert_one(dtc_obj.dict())
    return dtc_obj

@api_router.get("/dtc-codes/{vehicle_id}", response_model=List[DTCCode])
async def get_dtc_codes(vehicle_id: str):
    dtc_codes = await db.dtc_codes.find({"vehicle_id": vehicle_id}).sort("timestamp", -1).to_list(100)
    return [DTCCode(**dtc) for dtc in dtc_codes]

@api_router.delete("/dtc-codes/{vehicle_id}")
async def clear_dtc_codes(vehicle_id: str):
    result = await db.dtc_codes.delete_many({"vehicle_id": vehicle_id})
    return {"deleted_count": result.deleted_count}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
