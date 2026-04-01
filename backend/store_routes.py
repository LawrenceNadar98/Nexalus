from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from typing import List, Optional
from models import *
from auth import get_current_user, get_current_admin, hash_password, verify_password, create_access_token
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from datetime import datetime
import razorpay
import random
import string

router = APIRouter(prefix="/api/store", tags=["Store"])

# Database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'nexalus_store')]

# Razorpay client
razorpay_client = razorpay.Client(auth=(
    os.getenv("RAZORPAY_KEY_ID", ""),
    os.getenv("RAZORPAY_KEY_SECRET", "")
))

# Helper Functions
def generate_order_number():
    """Generate unique order number"""
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"NXL{timestamp}{random_str}"

def calculate_shipping_cost(state: str) -> float:
    """Calculate shipping cost based on state"""
    metro_cities = ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Gujarat"]
    if state in metro_cities:
        return 50.0
    else:
        return 100.0

# ==================== PRODUCT ROUTES ====================

@router.get("/products")
async def get_products(
    category: Optional[ProductCategory] = None,
    condition: Optional[ProductCondition] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 20
):
    """Get products with filters"""
    query = {"is_active": True}
    
    if category:
        query["category"] = category
    if condition:
        query["condition"] = condition
    if brand:
        query["brand"] = brand
    if min_price is not None:
        query["price"] = {"$gte": min_price}
    if max_price is not None:
        if "price" in query:
            query["price"]["$lte"] = max_price
        else:
            query["price"] = {"$lte": max_price}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"brand": {"$regex": search, "$options": "i"}}
        ]
    
    products = await db.products.find(query).skip(skip).limit(limit).to_list(limit)
    total = await db.products.count_documents(query)
    
    # Convert ObjectId to string
    for product in products:
        product["_id"] = str(product["_id"])
    
    return {
        "products": products,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.get("/products/{product_id}")
async def get_product(product_id: str):
    """Get single product details"""
    try:
        product = await db.products.find_one({"_id": ObjectId(product_id)})
    except:
        product = await db.products.find_one({"_id": product_id})
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Convert ObjectId to string
    product["_id"] = str(product["_id"])
    return product

@router.get("/brands")
async def get_brands():
    """Get all unique brands"""
    brands = await db.products.distinct("brand")
    return {"brands": brands}

@router.get("/categories")
async def get_categories():
    """Get all product categories"""
    return {"categories": [cat.value for cat in ProductCategory]}

# ==================== CART ROUTES ====================

@router.post("/cart/add")
async def add_to_cart(
    item: AddToCart,
    current_user: dict = Depends(get_current_user)
):
    """Add item to cart"""
    user_id = current_user["user_id"]
    
    # Check if product exists and has stock
    try:
        product = await db.products.find_one({"_id": ObjectId(item.product_id), "is_active": True})
    except:
        product = await db.products.find_one({"_id": item.product_id, "is_active": True})
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product["stock_quantity"] < item.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    
    # Get or create cart
    cart = await db.carts.find_one({"user_id": user_id})
    
    if not cart:
        cart = {
            "user_id": user_id,
            "items": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    
    # Check if item already in cart
    item_exists = False
    for cart_item in cart.get("items", []):
        if str(cart_item["product_id"]) == str(item.product_id):
            cart_item["quantity"] += item.quantity
            item_exists = True
            break
    
    if not item_exists:
        cart.setdefault("items", []).append({
            "product_id": item.product_id,
            "quantity": item.quantity,
            "price": product["price"]
        })
    
    cart["updated_at"] = datetime.utcnow()
    
    await db.carts.update_one(
        {"user_id": user_id},
        {"$set": cart},
        upsert=True
    )
    
    return {"message": "Item added to cart", "cart": cart}

@router.get("/cart")
async def get_cart(current_user: dict = Depends(get_current_user)):
    """Get user's cart with product details"""
    user_id = current_user["user_id"]
    cart = await db.carts.find_one({"user_id": user_id})
    
    if not cart or not cart.get("items"):
        return {"items": [], "total": 0}
    
    # Fetch product details for each cart item
    cart_items_with_details = []
    total = 0
    
    for item in cart["items"]:
        try:
            product = await db.products.find_one({"_id": ObjectId(item["product_id"])})
        except:
            product = await db.products.find_one({"_id": item["product_id"]})
            
        if product and product["is_active"]:
            # Convert ObjectId to string
            product["_id"] = str(product["_id"])
            item_total = product["price"] * item["quantity"]
            cart_items_with_details.append({
                "product": product,
                "quantity": item["quantity"],
                "item_total": item_total
            })
            total += item_total
    
    return {
        "items": cart_items_with_details,
        "total": total
    }

@router.put("/cart/update/{product_id}")
async def update_cart_item(
    product_id: str,
    quantity: int,
    current_user: dict = Depends(get_current_user)
):
    """Update cart item quantity"""
    user_id = current_user["user_id"]
    
    if quantity < 0:
        raise HTTPException(status_code=400, detail="Invalid quantity")
    
    cart = await db.carts.find_one({"user_id": user_id})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    if quantity == 0:
        # Remove item from cart
        cart["items"] = [item for item in cart["items"] if item["product_id"] != product_id]
    else:
        # Update quantity
        for item in cart["items"]:
            if item["product_id"] == product_id:
                item["quantity"] = quantity
                break
    
    cart["updated_at"] = datetime.utcnow()
    
    await db.carts.update_one(
        {"user_id": user_id},
        {"$set": cart}
    )
    
    return {"message": "Cart updated"}

@router.delete("/cart/clear")
async def clear_cart(current_user: dict = Depends(get_current_user)):
    """Clear user's cart"""
    user_id = current_user["user_id"]
    await db.carts.delete_one({"user_id": user_id})
    return {"message": "Cart cleared"}

# ==================== CHECKOUT & ORDER ROUTES ====================

@router.post("/checkout")
async def checkout(
    checkout_data: CheckoutRequest,
    current_user: dict = Depends(get_current_user)
):
    """Create order and Razorpay payment"""
    user_id = current_user["user_id"]
    
    # Get user details
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get cart
    cart = await db.carts.find_one({"user_id": user_id})
    if not cart or not cart.get("items"):
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Calculate order details
    order_items = []
    subtotal = 0
    
    for cart_item in cart["items"]:
        product = await db.products.find_one({"_id": cart_item["product_id"]})
        if not product or not product["is_active"]:
            continue
        
        if product["stock_quantity"] < cart_item["quantity"]:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product['name']}"
            )
        
        item_total = product["price"] * cart_item["quantity"]
        order_items.append({
            "product_id": cart_item["product_id"],
            "product_name": product["name"],
            "quantity": cart_item["quantity"],
            "price": product["price"],
            "total": item_total
        })
        subtotal += item_total
    
    # Calculate costs
    shipping_cost = calculate_shipping_cost(checkout_data.shipping_address.state)
    gst_amount = subtotal * 0.18  # 18% GST
    total_amount = subtotal + shipping_cost + gst_amount
    
    # Create order in database
    order_number = generate_order_number()
    order = {
        "order_number": order_number,
        "user_id": user_id,
        "user_email": user["email"],
        "user_name": user["full_name"],
        "user_phone": user["phone"],
        "whatsapp_number": checkout_data.whatsapp_number,
        "items": order_items,
        "subtotal": subtotal,
        "shipping_cost": shipping_cost,
        "gst_amount": gst_amount,
        "total_amount": total_amount,
        "has_gst": checkout_data.has_gst,
        "gst_number": checkout_data.gst_number,
        "company_name": checkout_data.company_name,
        "shipping_address": checkout_data.shipping_address.dict(),
        "payment_status": "Pending",
        "status": "Pending",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.orders.insert_one(order)
    order_id = str(result.inserted_id)
    
    # Create Razorpay order
    razorpay_order = razorpay_client.order.create({
        "amount": int(total_amount * 100),  # Convert to paise
        "currency": "INR",
        "receipt": order_number,
        "notes": {
            "order_id": order_id,
            "user_email": user["email"]
        }
    })
    
    # Update order with Razorpay order ID
    await db.orders.update_one(
        {"_id": result.inserted_id},
        {"$set": {"razorpay_order_id": razorpay_order["id"]}}
    )
    
    return {
        "order_id": order_id,
        "order_number": order_number,
        "razorpay_order_id": razorpay_order["id"],
        "razorpay_key_id": os.getenv("RAZORPAY_KEY_ID"),
        "amount": total_amount,
        "currency": "INR"
    }

@router.post("/payment/verify")
async def verify_payment(
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
    current_user: dict = Depends(get_current_user)
):
    """Verify Razorpay payment"""
    try:
        # Verify signature
        razorpay_client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        })
        
        # Update order
        order = await db.orders.find_one({"razorpay_order_id": razorpay_order_id})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        await db.orders.update_one(
            {"razorpay_order_id": razorpay_order_id},
            {"$set": {
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature,
                "payment_status": "Completed",
                "status": "Confirmed",
                "updated_at": datetime.utcnow()
            }}
        )
        
        # Reduce stock
        for item in order["items"]:
            await db.products.update_one(
                {"_id": item["product_id"]},
                {"$inc": {"stock_quantity": -item["quantity"]}}
            )
        
        # Clear cart
        await db.carts.delete_one({"user_id": current_user["user_id"]})
        
        # TODO: Send WhatsApp invoice
        # This will be implemented with WhatsApp Business API
        
        return {
            "message": "Payment verified successfully",
            "order_number": order["order_number"]
        }
        
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid payment signature")

@router.get("/orders")
async def get_user_orders(current_user: dict = Depends(get_current_user)):
    """Get user's orders"""
    user_id = current_user["user_id"]
    orders = await db.orders.find({"user_id": user_id}).sort("created_at", -1).to_list(100)
    
    # Convert ObjectId to string
    for order in orders:
        order["_id"] = str(order["_id"])
    
    return {"orders": orders}

@router.get("/orders/{order_id}")
async def get_order(order_id: str, current_user: dict = Depends(get_current_user)):
    """Get order details"""
    order = await db.orders.find_one({"_id": order_id, "user_id": current_user["user_id"]})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Convert ObjectId to string
    order["_id"] = str(order["_id"])
    return order
