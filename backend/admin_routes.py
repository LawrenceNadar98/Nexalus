from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from typing import List, Optional
from models import *
from auth import get_current_admin
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime
import shutil
from pathlib import Path

router = APIRouter(prefix="/api/admin", tags=["Admin"])

# Database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'nexalus_store')]

# Upload directory
UPLOAD_DIR = Path("/app/backend/uploads/products")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# ==================== PRODUCT MANAGEMENT ====================

@router.post("/products")
async def create_product(
    name: str = Form(...),
    category: ProductCategory = Form(...),
    brand: str = Form(...),
    condition: ProductCondition = Form(...),
    description: str = Form(...),
    specifications: str = Form(...),  # JSON string
    price: float = Form(...),
    original_price: Optional[float] = Form(None),
    offer_percentage: Optional[float] = Form(0),
    stock_quantity: int = Form(...),
    sku: str = Form(...),
    images: List[UploadFile] = File([]),
    current_admin: dict = Depends(get_current_admin)
):
    """Create new product with images"""
    import json
    
    # Parse specifications
    try:
        specs = json.loads(specifications)
    except:
        specs = {}
    
    # Upload images
    image_urls = []
    for image in images:
        # Generate unique filename
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        filename = f"{sku}_{timestamp}_{image.filename}"
        filepath = UPLOAD_DIR / filename
        
        # Save file
        with filepath.open("wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        # Store relative URL
        image_urls.append(f"/uploads/products/{filename}")
    
    # Create product
    product = {
        "name": name,
        "category": category,
        "brand": brand,
        "condition": condition,
        "description": description,
        "specifications": specs,
        "images": image_urls,
        "price": price,
        "original_price": original_price or price,
        "offer_percentage": offer_percentage,
        "stock_quantity": stock_quantity,
        "sku": sku,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.products.insert_one(product)
    product["_id"] = str(result.inserted_id)
    
    return {"message": "Product created successfully", "product": product}

@router.put("/products/{product_id}")
async def update_product(
    product_id: str,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    specifications: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    original_price: Optional[float] = Form(None),
    offer_percentage: Optional[float] = Form(None),
    stock_quantity: Optional[int] = Form(None),
    is_active: Optional[bool] = Form(None),
    images: List[UploadFile] = File([]),
    current_admin: dict = Depends(get_current_admin)
):
    """Update product"""
    import json
    
    product = await db.products.find_one({"_id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = {"updated_at": datetime.utcnow()}
    
    if name:
        update_data["name"] = name
    if description:
        update_data["description"] = description
    if specifications:
        try:
            update_data["specifications"] = json.loads(specifications)
        except:
            pass
    if price is not None:
        update_data["price"] = price
    if original_price is not None:
        update_data["original_price"] = original_price
    if offer_percentage is not None:
        update_data["offer_percentage"] = offer_percentage
    if stock_quantity is not None:
        update_data["stock_quantity"] = stock_quantity
    if is_active is not None:
        update_data["is_active"] = is_active
    
    # Handle new images
    if images:
        image_urls = product.get("images", [])
        for image in images:
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            filename = f"{product['sku']}_{timestamp}_{image.filename}"
            filepath = UPLOAD_DIR / filename
            
            with filepath.open("wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            
            image_urls.append(f"/uploads/products/{filename}")
        
        update_data["images"] = image_urls
    
    await db.products.update_one(
        {"_id": product_id},
        {"$set": update_data}
    )
    
    return {"message": "Product updated successfully"}

@router.delete("/products/{product_id}")
async def delete_product(
    product_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Delete product (soft delete)"""
    result = await db.products.update_one(
        {"_id": product_id},
        {"$set": {"is_active": False, "updated_at": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {"message": "Product deleted successfully"}

@router.delete("/products/{product_id}/image")
async def delete_product_image(
    product_id: str,
    image_url: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Delete specific product image"""
    product = await db.products.find_one({"_id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    images = product.get("images", [])
    if image_url in images:
        images.remove(image_url)
        
        # Delete physical file
        try:
            filepath = Path("/app/backend") / image_url.lstrip("/")
            if filepath.exists():
                filepath.unlink()
        except:
            pass
        
        await db.products.update_one(
            {"_id": product_id},
            {"$set": {"images": images, "updated_at": datetime.utcnow()}}
        )
        
        return {"message": "Image deleted successfully"}
    
    raise HTTPException(status_code=404, detail="Image not found")

# ==================== ORDER MANAGEMENT ====================

@router.get("/orders")
async def get_all_orders(
    status: Optional[OrderStatus] = None,
    skip: int = 0,
    limit: int = 50,
    current_admin: dict = Depends(get_current_admin)
):
    """Get all orders"""
    query = {}
    if status:
        query["status"] = status
    
    orders = await db.orders.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    total = await db.orders.count_documents(query)
    
    # Convert ObjectId to string
    for order in orders:
        order["_id"] = str(order["_id"])
    
    return {
        "orders": orders,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.put("/orders/{order_id}/status")
async def update_order_status(
    order_id: str,
    status: OrderStatus,
    current_admin: dict = Depends(get_current_admin)
):
    """Update order status"""
    update_data = {
        "status": status,
        "updated_at": datetime.utcnow()
    }
    
    if status == OrderStatus.DELIVERED:
        update_data["delivered_at"] = datetime.utcnow()
    
    result = await db.orders.update_one(
        {"_id": order_id},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # TODO: Send WhatsApp notification to customer
    
    return {"message": "Order status updated successfully"}

# ==================== DASHBOARD STATS ====================

@router.get("/stats")
async def get_dashboard_stats(current_admin: dict = Depends(get_current_admin)):
    """Get dashboard statistics"""
    # Total products
    total_products = await db.products.count_documents({"is_active": True})
    
    # Low stock products
    low_stock = await db.products.count_documents({
        "is_active": True,
        "stock_quantity": {"$lt": 5}
    })
    
    # Total orders
    total_orders = await db.orders.count_documents({})
    
    # Pending orders
    pending_orders = await db.orders.count_documents({"status": "Pending"})
    
    # Revenue (completed orders)
    pipeline = [
        {"$match": {"payment_status": "Completed"}},
        {"$group": {"_id": None, "total": {"$sum": "$total_amount"}}}
    ]
    revenue_result = await db.orders.aggregate(pipeline).to_list(1)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0
    
    # Recent orders
    recent_orders = await db.orders.find().sort("created_at", -1).limit(10).to_list(10)
    
    # Top selling products
    pipeline = [
        {"$match": {"payment_status": "Completed"}},
        {"$unwind": "$items"},
        {"$group": {
            "_id": "$items.product_id",
            "total_quantity": {"$sum": "$items.quantity"},
            "product_name": {"$first": "$items.product_name"}
        }},
        {"$sort": {"total_quantity": -1}},
        {"$limit": 5}
    ]
    top_products = await db.orders.aggregate(pipeline).to_list(5)
    
    return {
        "total_products": total_products,
        "low_stock_count": low_stock,
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "total_revenue": total_revenue,
        "recent_orders": recent_orders,
        "top_selling_products": top_products
    }

@router.get("/products/low-stock")
async def get_low_stock_products(current_admin: dict = Depends(get_current_admin)):
    """Get products with low stock"""
    products = await db.products.find({
        "is_active": True,
        "stock_quantity": {"$lt": 5}
    }).to_list(100)
    
    return {"products": products}
