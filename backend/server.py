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
import secrets
import string


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
SECRET_KEY = os.environ.get('SECRET_KEY')
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable is required")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days

ADMIN_BOOTSTRAP_ENABLED = os.environ.get('ADMIN_BOOTSTRAP_ENABLED', 'false').lower() == 'true'
ADMIN_BOOTSTRAP_USERNAME = os.environ.get('ADMIN_BOOTSTRAP_USERNAME', 'admin')
ADMIN_BOOTSTRAP_PASSWORD = os.environ.get('ADMIN_BOOTSTRAP_PASSWORD')
ADMIN_BOOTSTRAP_EMAIL = os.environ.get('ADMIN_BOOTSTRAP_EMAIL', 'admin@obddiagnostik.com')
ADMIN_BOOTSTRAP_FORCE_RESET = os.environ.get('ADMIN_BOOTSTRAP_FORCE_RESET', 'false').lower() == 'true'

VERIFICATION_CODE_LENGTH = int(os.environ.get('VERIFICATION_CODE_LENGTH', '6'))
VERIFICATION_CODE_TTL_MINUTES = int(os.environ.get('VERIFICATION_CODE_TTL_MINUTES', '10'))
DEBUG_VERIFICATION_CODES = os.environ.get('DEBUG_VERIFICATION_CODES', 'false').lower() == 'true'

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")


# ============ Models ============

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    password_hash: str
    credits: int = 0
    is_admin: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    credits: int
    is_admin: bool

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class CreditGift(BaseModel):
    username: str
    amount: int

class ModulePurchase(BaseModel):
    module_name: str
    cost: int

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class VerifyCodeRequest(BaseModel):
    email: EmailStr
    code: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    code: str
    new_password: str

class VerifyEmailRequest(BaseModel):
    email: EmailStr
    code: str

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class VehicleInfo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
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
    user_id: str
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
    user_id: str
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


# ============ Utilities ============

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def generate_username_suggestions(base_username: str, count: int = 3) -> List[str]:
    suggestions = []
    for _ in range(count):
        suffix = ''.join(random.choices(string.digits, k=4))
        suggestions.append(f"{base_username}{suffix}")
    return suggestions

def generate_verification_code(length: int = VERIFICATION_CODE_LENGTH) -> str:
    safe_length = max(4, min(10, length))
    return ''.join(secrets.choice(string.digits) for _ in range(safe_length))

def is_verification_expired(verification: dict) -> bool:
    now = datetime.utcnow()
    expires_at = verification.get("expires_at")
    if isinstance(expires_at, datetime):
        return expires_at < now
    created_at = verification.get("created_at")
    if isinstance(created_at, datetime):
        return created_at + timedelta(minutes=VERIFICATION_CODE_TTL_MINUTES) < now
    return True

async def upsert_verification_code(email: str, code_type: str) -> str:
    code = generate_verification_code()
    await db.verification_codes.update_one(
        {"email": email, "type": code_type},
        {
            "$set": {
                "code": code,
                "created_at": datetime.utcnow(),
                "expires_at": datetime.utcnow() + timedelta(minutes=VERIFICATION_CODE_TTL_MINUTES),
            }
        },
        upsert=True
    )
    return code

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)

async def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


# ============ Initialization ============

async def create_admin_user():
    """Create admin user if enabled via environment"""
    logger = logging.getLogger(__name__)
    if not ADMIN_BOOTSTRAP_ENABLED:
        return
    if not ADMIN_BOOTSTRAP_PASSWORD:
        logger.warning("ADMIN_BOOTSTRAP_ENABLED is true but ADMIN_BOOTSTRAP_PASSWORD is not set; skipping admin bootstrap")
        return

    admin = await db.users.find_one({"username": ADMIN_BOOTSTRAP_USERNAME})
    if admin and not ADMIN_BOOTSTRAP_FORCE_RESET:
        logger.info("Admin user already exists; bootstrap skipped for %s", ADMIN_BOOTSTRAP_USERNAME)
        return

    admin_payload = {
        "username": ADMIN_BOOTSTRAP_USERNAME,
        "email": ADMIN_BOOTSTRAP_EMAIL,
        "password_hash": hash_password(ADMIN_BOOTSTRAP_PASSWORD),
        "credits": 999999999,
        "is_admin": True,
    }

    if admin:
        await db.users.update_one(
            {"username": ADMIN_BOOTSTRAP_USERNAME},
            {"$set": admin_payload}
        )
        logger.info("Admin user reset via bootstrap: %s", ADMIN_BOOTSTRAP_USERNAME)
    else:
        admin_user = User(**admin_payload)
        await db.users.insert_one(admin_user.dict())
        logger.info("Admin user created via bootstrap: %s", ADMIN_BOOTSTRAP_USERNAME)

@app.on_event("startup")
async def startup_event():
    await create_admin_user()


# ============ Auth Routes ============

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    # Check if username exists
    existing_user = await db.users.find_one({"username": user_data.username})
    if existing_user:
        suggestions = generate_username_suggestions(user_data.username)
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Bu kullanıcı adı daha önce alınmıştır",
                "suggestions": suggestions
            }
        )
    
    # Check if email exists
    existing_email = await db.users.find_one({"email": user_data.email})
    if existing_email:
        raise HTTPException(
            status_code=400,
            detail={"message": "Bu e-posta adresi zaten kayıtlı"}
        )
    
    # Create new user
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        credits=100,  # Welcome bonus
        is_admin=False
    )
    
    await db.users.insert_one(new_user.dict())
    
    # Create access token
    access_token = create_access_token(data={"sub": new_user.id})
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=new_user.id,
            username=new_user.username,
            email=new_user.email,
            credits=new_user.credits,
            is_admin=new_user.is_admin
        )
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"username": credentials.username})
    if not user or not verify_password(credentials.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Kullanıcı adı veya şifre hatalı")
    
    user_obj = User(**user)
    access_token = create_access_token(data={"sub": user_obj.id})
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user_obj.id,
            username=user_obj.username,
            email=user_obj.email,
            credits=user_obj.credits,
            is_admin=user_obj.is_admin
        )
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        credits=current_user.credits,
        is_admin=current_user.is_admin
    )


# ============ Password Reset Routes ============

@api_router.post("/auth/forgot-password")
async def forgot_password(request: ForgotPasswordRequest):
    """Send password reset code (always returns success for security)"""
    user = await db.users.find_one({"email": request.email})
    if user:
        code = await upsert_verification_code(request.email, "password_reset")
        if DEBUG_VERIFICATION_CODES:
            return {
                "message": "Eğer bu e-posta kayıtlıysa, doğrulama kodu gönderildi",
                "success": True,
                "debug_code": code,
            }
    # Always return success to prevent email enumeration
    return {"message": "Eğer bu e-posta kayıtlıysa, doğrulama kodu gönderildi", "success": True}

@api_router.post("/auth/verify-reset-code")
async def verify_reset_code(request: VerifyCodeRequest):
    """Verify the password reset code"""
    verification = await db.verification_codes.find_one({
        "email": request.email,
        "type": "password_reset",
        "code": request.code
    })

    if not verification or is_verification_expired(verification):
        if verification and is_verification_expired(verification):
            await db.verification_codes.delete_one({"_id": verification["_id"]})
        raise HTTPException(status_code=400, detail="Doğrulama kodu hatalı veya süresi dolmuş")
    
    return {"message": "Doğrulama başarılı", "verified": True}

@api_router.post("/auth/reset-password")
async def reset_password(request: ResetPasswordRequest):
    """Reset password with verification code"""
    # Verify code
    verification = await db.verification_codes.find_one({
        "email": request.email,
        "type": "password_reset",
        "code": request.code
    })

    if not verification or is_verification_expired(verification):
        if verification and is_verification_expired(verification):
            await db.verification_codes.delete_one({"_id": verification["_id"]})
        raise HTTPException(status_code=400, detail="Doğrulama kodu hatalı veya süresi dolmuş")
    
    # Update password
    result = await db.users.update_one(
        {"email": request.email},
        {"$set": {"password_hash": hash_password(request.new_password)}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    
    # Delete verification code
    await db.verification_codes.delete_one({"_id": verification["_id"]})
    
    return {"message": "Şifreniz başarıyla değiştirildi", "success": True}

@api_router.post("/auth/send-verification")
async def send_verification(request: ForgotPasswordRequest):
    """Send email verification code for new registration"""
    code = await upsert_verification_code(request.email, "email_verification")
    response = {"message": "Doğrulama kodu gönderildi", "success": True}
    if DEBUG_VERIFICATION_CODES:
        response["debug_code"] = code
    return response

@api_router.post("/auth/verify-email")
async def verify_email(request: VerifyEmailRequest):
    """Verify email with code"""
    verification = await db.verification_codes.find_one({
        "email": request.email,
        "type": "email_verification",
        "code": request.code
    })

    if not verification or is_verification_expired(verification):
        if verification and is_verification_expired(verification):
            await db.verification_codes.delete_one({"_id": verification["_id"]})
        raise HTTPException(status_code=400, detail="Doğrulama kodu hatalı veya süresi dolmuş")
    
    # Mark email as verified
    await db.users.update_one(
        {"email": request.email},
        {"$set": {"email_verified": True}}
    )
    
    # Delete verification code
    await db.verification_codes.delete_one({"_id": verification["_id"]})
    
    return {"message": "E-posta doğrulandı", "verified": True}

@api_router.get("/admin/users")
async def get_all_users(admin: User = Depends(get_admin_user)):
    """Admin only: Get all users"""
    users = await db.users.find({}).to_list(1000)
    return {
        "users": [
            {
                "id": u['id'],
                "username": u['username'],
                "email": u['email'],
                "credits": u['credits'],
                "is_admin": u.get('is_admin', False)
            }
            for u in users
        ]
    }

@api_router.post("/auth/change-password")
async def change_password(request: ChangePasswordRequest, current_user: User = Depends(get_current_user)):
    """Change password for current user"""
    # Verify old password
    user = await db.users.find_one({"id": current_user.id})
    if not user or not verify_password(request.old_password, user['password_hash']):
        raise HTTPException(status_code=400, detail="Mevcut şifre hatalı")
    
    # Validate new password
    if len(request.new_password) < 4:
        raise HTTPException(status_code=400, detail="Yeni şifre en az 4 karakter olmalıdır")
    
    # Update password
    await db.users.update_one(
        {"id": current_user.id},
        {"$set": {"password_hash": hash_password(request.new_password)}}
    )
    
    return {"message": "Şifreniz başarıyla değiştirildi", "success": True}


# ============ Credit Routes ============

@api_router.post("/credits/gift")
async def gift_credits(gift: CreditGift, admin: User = Depends(get_admin_user)):
    """Admin only: Gift credits to a user"""
    user = await db.users.find_one({"username": gift.username})
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    
    new_credits = user['credits'] + gift.amount
    await db.users.update_one(
        {"id": user['id']},
        {"$set": {"credits": new_credits}}
    )
    
    # Log transaction
    await db.credit_transactions.insert_one({
        "id": str(uuid.uuid4()),
        "from_user": admin.id,
        "to_user": user['id'],
        "amount": gift.amount,
        "type": "gift",
        "timestamp": datetime.utcnow()
    })
    
    return {"message": f"{gift.amount} kredi {gift.username} kullanıcısına gönderildi", "new_balance": new_credits}

@api_router.get("/credits/balance")
async def get_balance(current_user: User = Depends(get_current_user)):
    return {"credits": current_user.credits}


# ============ Module Purchase Routes ============

MODULES = {
    "throttle_adaptation": {"name": "Gaz Kelebeği Adaptasyonu", "cost": 50},
    "egr_diagnostics": {"name": "EGR Tanılama", "cost": 50},
    "abs_diagnostics": {"name": "ABS Tanılama", "cost": 75},
    "sas_calibration": {"name": "SAS Kalibrasyonu", "cost": 100},
    "epb_service": {"name": "EPB Servisi", "cost": 75},
    "brake_reset": {"name": "Fren Balatası Sıfırlama", "cost": 50},
    "dpf_regeneration": {"name": "DPF Rejenerasyonu", "cost": 100},
    "tpms_diagnostics": {"name": "TPMS Tanılama", "cost": 50},
    "oil_service_reset": {"name": "Yağ Servis Sıfırlama", "cost": 25},
}

@api_router.get("/modules")
async def get_modules():
    return {"modules": MODULES}

@api_router.post("/modules/purchase")
async def purchase_module(purchase: ModulePurchase, current_user: User = Depends(get_current_user)):
    if purchase.module_name not in MODULES:
        raise HTTPException(status_code=404, detail="Modül bulunamadı")
    
    module = MODULES[purchase.module_name]
    
    if current_user.credits < module['cost']:
        raise HTTPException(
            status_code=400,
            detail=f"Yetersiz kredi. Gereken: {module['cost']}, Mevcut: {current_user.credits}"
        )
    
    # Deduct credits
    new_credits = current_user.credits - module['cost']
    await db.users.update_one(
        {"id": current_user.id},
        {"$set": {"credits": new_credits}}
    )
    
    # Add purchased module to user
    await db.user_modules.update_one(
        {"user_id": current_user.id},
        {"$addToSet": {"modules": purchase.module_name}},
        upsert=True
    )
    
    # Log transaction
    await db.credit_transactions.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": current_user.id,
        "module": purchase.module_name,
        "amount": -module['cost'],
        "type": "purchase",
        "timestamp": datetime.utcnow()
    })
    
    return {"message": f"{module['name']} satın alındı", "new_balance": new_credits}

@api_router.get("/modules/my-modules")
async def get_my_modules(current_user: User = Depends(get_current_user)):
    user_modules = await db.user_modules.find_one({"user_id": current_user.id})
    if not user_modules:
        return {"modules": []}
    return {"modules": user_modules.get('modules', [])}


# ============ Vehicle Routes ============

@api_router.post("/vehicles", response_model=VehicleInfo)
async def create_vehicle(vehicle: VehicleInfoCreate, current_user: User = Depends(get_current_user)):
    vehicle_dict = vehicle.dict()
    vehicle_dict['user_id'] = current_user.id
    vehicle_obj = VehicleInfo(**vehicle_dict)
    await db.vehicles.insert_one(vehicle_obj.dict())
    return vehicle_obj

@api_router.get("/vehicles", response_model=List[VehicleInfo])
async def get_vehicles(current_user: User = Depends(get_current_user)):
    vehicles = await db.vehicles.find({"user_id": current_user.id}).sort("created_at", -1).to_list(100)
    return [VehicleInfo(**vehicle) for vehicle in vehicles]

@api_router.get("/vehicles/{vehicle_id}", response_model=VehicleInfo)
async def get_vehicle(vehicle_id: str, current_user: User = Depends(get_current_user)):
    vehicle = await db.vehicles.find_one({"id": vehicle_id, "user_id": current_user.id})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return VehicleInfo(**vehicle)


# ============ OBD Session Routes ============

@api_router.post("/obd-sessions", response_model=OBDSession)
async def create_obd_session(session: OBDSessionCreate, current_user: User = Depends(get_current_user)):
    session_dict = session.dict()
    session_dict['user_id'] = current_user.id
    session_obj = OBDSession(**session_dict)
    await db.obd_sessions.insert_one(session_obj.dict())
    return session_obj

@api_router.get("/obd-sessions/{vehicle_id}", response_model=List[OBDSession])
async def get_obd_sessions(vehicle_id: str, current_user: User = Depends(get_current_user)):
    sessions = await db.obd_sessions.find({"vehicle_id": vehicle_id, "user_id": current_user.id}).sort("timestamp", -1).to_list(100)
    return [OBDSession(**session) for session in sessions]


# ============ DTC Routes ============

@api_router.post("/dtc-codes", response_model=DTCCode)
async def create_dtc_code(dtc: DTCCodeCreate, current_user: User = Depends(get_current_user)):
    dtc_dict = dtc.dict()
    dtc_dict['user_id'] = current_user.id
    dtc_obj = DTCCode(**dtc_dict)
    await db.dtc_codes.insert_one(dtc_obj.dict())
    return dtc_obj

@api_router.get("/dtc-codes/{vehicle_id}", response_model=List[DTCCode])
async def get_dtc_codes(vehicle_id: str, current_user: User = Depends(get_current_user)):
    dtc_codes = await db.dtc_codes.find({"vehicle_id": vehicle_id, "user_id": current_user.id}).sort("timestamp", -1).to_list(100)
    return [DTCCode(**dtc) for dtc in dtc_codes]

@api_router.delete("/dtc-codes/{vehicle_id}")
async def clear_dtc_codes(vehicle_id: str, current_user: User = Depends(get_current_user)):
    result = await db.dtc_codes.delete_many({"vehicle_id": vehicle_id, "user_id": current_user.id})
    return {"deleted_count": result.deleted_count}


# ============ Root Route ============

@api_router.get("/")
async def root():
    return {"message": "OBD-II Diagnostik API v2.0", "status": "running"}


# Include router
app.include_router(api_router)

# CORS
raw_allowed_origins = os.environ.get("ALLOWED_ORIGINS", "")
allowed_origins = [origin.strip() for origin in raw_allowed_origins.split(",") if origin.strip()]
cors_allow_origins = allowed_origins or ["*"]
cors_allow_credentials = bool(allowed_origins)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=cors_allow_credentials,
    allow_origins=cors_allow_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
