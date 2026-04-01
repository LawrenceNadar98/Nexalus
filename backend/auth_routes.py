from fastapi import APIRouter, HTTPException
from models import UserRegister, UserLogin, AdminLogin
from auth import hash_password, verify_password, create_access_token
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timedelta
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'nexalus_store')]

# OTP Storage (in production, use Redis or similar)
otp_storage = {}

def generate_otp():
    """Generate 6-digit OTP"""
    return str(random.randint(100000, 999999))

def send_otp_email(email, otp):
    """Send OTP via email"""
    try:
        # Email configuration (using Gmail SMTP)
        sender_email = os.getenv("SMTP_EMAIL", "noreply@nexalusinfotech.com")
        sender_password = os.getenv("SMTP_PASSWORD", "")
        
        if not sender_password:
            print("⚠️ SMTP not configured. OTP:", otp)
            return True  # For development, just log the OTP
        
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = email
        msg['Subject'] = "Password Reset OTP - Nexalus Store"
        
        body = f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2563eb;">Password Reset Request</h2>
                <p>You have requested to reset your password for Nexalus Store.</p>
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="font-size: 16px; margin: 0;">Your OTP is:</p>
                    <h1 style="color: #2563eb; font-size: 36px; margin: 10px 0; letter-spacing: 5px;">{otp}</h1>
                </div>
                <p><strong>This OTP will expire in 10 minutes.</strong></p>
                <p>If you didn't request this, please ignore this email.</p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 12px;">Nexalus Infotech - ELV & ICT Solutions</p>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return True  # Return True anyway for development

# ==================== USER AUTHENTICATION ====================

@router.post("/register")
async def register_user(user_data: UserRegister):
    """Register new user"""
    # Check if email already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = {
        "email": user_data.email,
        "password_hash": hash_password(user_data.password),
        "full_name": user_data.full_name,
        "phone": user_data.phone,
        "is_verified": False,
        "created_at": datetime.utcnow()
    }
    
    result = await db.users.insert_one(user)
    user_id = str(result.inserted_id)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id, "type": "user"})
    
    return {
        "message": "Registration successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": user_data.email,
            "full_name": user_data.full_name,
            "phone": user_data.phone
        }
    }

@router.post("/login")
async def login_user(credentials: UserLogin):
    """User login"""
    user = await db.users.find_one({"email": credentials.email})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user["_id"]), "type": "user"})
    
    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "full_name": user["full_name"],
            "phone": user["phone"]
        }
    }

@router.post("/google")
async def google_auth(google_token: str, full_name: str, email: str, phone: str):
    """Google OAuth authentication"""
    # In production, verify google_token with Google API
    # For now, simplified implementation
    
    # Check if user exists
    user = await db.users.find_one({"email": email})
    
    if not user:
        # Create new user
        user = {
            "email": email,
            "full_name": full_name,
            "phone": phone,
            "google_id": google_token,
            "is_verified": True,
            "created_at": datetime.utcnow()
        }
        result = await db.users.insert_one(user)
        user_id = str(result.inserted_id)
    else:
        user_id = str(user["_id"])
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id, "type": "user"})
    
    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": email,
            "full_name": full_name,
            "phone": phone
        }
    }

# ==================== FORGOT PASSWORD ====================

@router.post("/forgot-password")
async def forgot_password(email: str):
    """Send OTP for password reset"""
    # Check if user exists
    user = await db.users.find_one({"email": email})
    if not user:
        # Don't reveal if email exists for security
        return {"message": "If the email exists, an OTP has been sent"}
    
    # Generate OTP
    otp = generate_otp()
    
    # Store OTP with expiry (10 minutes)
    otp_storage[email] = {
        "otp": otp,
        "expires_at": datetime.utcnow() + timedelta(minutes=10)
    }
    
    # Send OTP via email
    send_otp_email(email, otp)
    
    return {"message": "OTP sent to your email", "email": email}

@router.post("/verify-otp")
async def verify_otp(email: str, otp: str):
    """Verify OTP"""
    stored_otp = otp_storage.get(email)
    
    if not stored_otp:
        raise HTTPException(status_code=400, detail="OTP not found or expired")
    
    if datetime.utcnow() > stored_otp["expires_at"]:
        del otp_storage[email]
        raise HTTPException(status_code=400, detail="OTP expired")
    
    if stored_otp["otp"] != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # OTP verified, generate reset token
    reset_token = create_access_token(data={"sub": email, "type": "reset"})
    
    return {
        "message": "OTP verified",
        "reset_token": reset_token
    }

@router.post("/reset-password")
async def reset_password(reset_token: str, new_password: str):
    """Reset password using reset token"""
    from auth import decode_token
    
    try:
        payload = decode_token(reset_token)
        email = payload.get("sub")
        token_type = payload.get("type")
        
        if token_type != "reset":
            raise HTTPException(status_code=400, detail="Invalid reset token")
        
        # Update password
        new_hash = hash_password(new_password)
        result = await db.users.update_one(
            {"email": email},
            {"$set": {"password_hash": new_hash}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Clear OTP from storage
        if email in otp_storage:
            del otp_storage[email]
        
        return {"message": "Password reset successful"}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== ADMIN AUTHENTICATION ====================

@router.post("/admin/login")
async def login_admin(credentials: AdminLogin):
    """Admin login"""
    admin = await db.admins.find_one({"username": credentials.username})
    
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    if not verify_password(credentials.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Create access token
    access_token = create_access_token(data={"sub": str(admin["_id"]), "type": "admin"})
    
    return {
        "message": "Admin login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "admin": {
            "id": str(admin["_id"]),
            "username": admin["username"],
            "email": admin["email"],
            "full_name": admin["full_name"]
        }
    }

@router.post("/admin/create")
async def create_admin(
    username: str,
    password: str,
    email: str,
    full_name: str,
    secret_key: str
):
    """Create admin account (requires secret key)"""
    # Secret key check - only for initial admin creation
    if secret_key != os.getenv("ADMIN_SECRET_KEY", "nexalus-admin-secret-2025"):
        raise HTTPException(status_code=403, detail="Invalid secret key")
    
    # Check if admin already exists
    existing_admin = await db.admins.find_one({"username": username})
    if existing_admin:
        raise HTTPException(status_code=400, detail="Admin username already exists")
    
    # Create admin
    admin = {
        "username": username,
        "password_hash": hash_password(password),
        "email": email,
        "full_name": full_name,
        "is_super_admin": True,
        "created_at": datetime.utcnow()
    }
    
    result = await db.admins.insert_one(admin)
    
    return {
        "message": "Admin created successfully",
        "admin_id": str(result.inserted_id)
    }
