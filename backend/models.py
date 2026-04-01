from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

# Enums
class ProductCategory(str, Enum):
    CCTV = "CCTV"
    IT_NETWORKING = "IT Networking"
    LAPTOP = "Laptop"
    DESKTOP = "Desktop"
    SERVER = "Server"

class ProductCondition(str, Enum):
    NEW = "New"
    REFURBISHED = "Refurbished"
    OPEN_BOX = "Open Box"

class OrderStatus(str, Enum):
    PENDING = "Pending"
    CONFIRMED = "Confirmed"
    PROCESSING = "Processing"
    SHIPPED = "Shipped"
    DELIVERED = "Delivered"
    CANCELLED = "Cancelled"

# Product Model
class Product(BaseModel):
    id: Optional[str] = None
    name: str
    category: ProductCategory
    brand: str
    condition: ProductCondition
    description: str
    specifications: dict  # {"RAM": "8GB", "Storage": "256GB SSD", etc.}
    images: List[str] = []  # URLs to product images
    price: float
    original_price: Optional[float] = None  # For showing discounts
    offer_percentage: Optional[float] = 0
    stock_quantity: int
    sku: str  # Stock Keeping Unit
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# User Model
class User(BaseModel):
    id: Optional[str] = None
    email: EmailStr
    password_hash: Optional[str] = None  # None for Google OAuth users
    full_name: str
    phone: str
    google_id: Optional[str] = None
    is_verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Address(BaseModel):
    street: str
    city: str
    state: str
    postal_code: str
    country: str = "India"
    phone: str

# Cart Models
class CartItem(BaseModel):
    product_id: str
    quantity: int
    price: float  # Price at the time of adding to cart

class Cart(BaseModel):
    id: Optional[str] = None
    user_id: str
    items: List[CartItem] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Order Models
class OrderItem(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    price: float
    total: float

class Order(BaseModel):
    id: Optional[str] = None
    order_number: str  # Unique order number
    user_id: str
    user_email: str
    user_name: str
    user_phone: str
    whatsapp_number: str  # For invoice delivery
    items: List[OrderItem]
    subtotal: float
    shipping_cost: float
    gst_amount: float
    total_amount: float
    
    # GST Details (optional for B2B customers)
    has_gst: bool = False
    gst_number: Optional[str] = None
    company_name: Optional[str] = None
    
    # Shipping Address
    shipping_address: Address
    
    # Payment Details
    payment_id: Optional[str] = None
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    razorpay_signature: Optional[str] = None
    payment_status: str = "Pending"
    
    # Order Status
    status: OrderStatus = OrderStatus.PENDING
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    delivered_at: Optional[datetime] = None

# Admin Model
class Admin(BaseModel):
    id: Optional[str] = None
    username: str
    password_hash: str
    email: EmailStr
    full_name: str
    is_super_admin: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Request/Response Models
class ProductCreate(BaseModel):
    name: str
    category: ProductCategory
    brand: str
    condition: ProductCondition
    description: str
    specifications: dict
    price: float
    original_price: Optional[float] = None
    offer_percentage: Optional[float] = 0
    stock_quantity: int
    sku: str

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    specifications: Optional[dict] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    offer_percentage: Optional[float] = None
    stock_quantity: Optional[int] = None
    is_active: Optional[bool] = None

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class AdminLogin(BaseModel):
    username: str
    password: str

class AddToCart(BaseModel):
    product_id: str
    quantity: int = 1

class CheckoutRequest(BaseModel):
    shipping_address: Address
    whatsapp_number: str
    has_gst: bool = False
    gst_number: Optional[str] = None
    company_name: Optional[str] = None
