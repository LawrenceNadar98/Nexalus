#!/bin/bash

echo "=========================================="
echo "Nexalus Store - Quick Setup Script"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:8001"

echo -e "${BLUE}Step 1: Creating Admin Account${NC}"
echo "Username: admin | Password: admin123"
echo ""

ADMIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/admin/create" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "email": "admin@nexalusinfotech.com",
    "full_name": "Admin User",
    "secret_key": "nexalus-admin-secret-2025"
  }')

if echo "$ADMIN_RESPONSE" | grep -q "admin_id"; then
  echo -e "${GREEN}✓ Admin account created successfully!${NC}"
else
  echo -e "${YELLOW}Admin account might already exist or check backend logs${NC}"
fi

echo ""
echo -e "${BLUE}Step 2: Logging in as Admin${NC}"

ADMIN_TOKEN=$(curl -s -X POST "$API_URL/api/auth/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin).get('access_token', ''))")

if [ -n "$ADMIN_TOKEN" ]; then
  echo -e "${GREEN}✓ Admin login successful!${NC}"
else
  echo -e "${YELLOW}⚠ Login failed. Check credentials.${NC}"
  exit 1
fi

echo ""
echo -e "${BLUE}Step 3: Adding Sample Products${NC}"
echo ""

# Product 1: CCTV
echo "Adding Hikvision CCTV..."
curl -s -X POST "$API_URL/api/admin/products" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "name=Hikvision 2MP Dome CCTV Camera" \
  -F "category=CCTV" \
  -F "brand=Hikvision" \
  -F "condition=New" \
  -F "description=High-definition 2MP CCTV dome camera with 30m night vision, weatherproof design" \
  -F 'specifications={"Resolution":"1080p","Type":"Dome","Night Vision":"30m","Warranty":"2 Years"}' \
  -F "price=2500" \
  -F "original_price=3500" \
  -F "offer_percentage=28" \
  -F "stock_quantity=50" \
  -F "sku=HIK-2MP-001" > /dev/null

echo -e "${GREEN}✓ Product 1 added${NC}"

# Product 2: IT Networking
echo "Adding TP-Link Switch..."
curl -s -X POST "$API_URL/api/admin/products" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "name=TP-Link 24 Port Gigabit Switch" \
  -F "category=IT Networking" \
  -F "brand=TP-Link" \
  -F "condition=New" \
  -F "description=24-Port Gigabit Ethernet Managed Switch for enterprise networks" \
  -F 'specifications={"Ports":"24","Speed":"1Gbps","Type":"Managed","Power":"100-240V"}' \
  -F "price=8500" \
  -F "original_price=12000" \
  -F "offer_percentage=29" \
  -F "stock_quantity=15" \
  -F "sku=TPL-SW24-001" > /dev/null

echo -e "${GREEN}✓ Product 2 added${NC}"

# Product 3: Laptop
echo "Adding Dell Laptop..."
curl -s -X POST "$API_URL/api/admin/products" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "name=Dell Latitude 5420 Business Laptop" \
  -F "category=Laptop" \
  -F "brand=Dell" \
  -F "condition=Refurbished" \
  -F "description=Professional 14-inch business laptop with Intel i5, perfect for office work" \
  -F 'specifications={"Processor":"Intel i5 11th Gen","RAM":"8GB DDR4","Storage":"256GB SSD","Display":"14 FHD","OS":"Windows 11 Pro"}' \
  -F "price=32000" \
  -F "original_price=45000" \
  -F "offer_percentage=29" \
  -F "stock_quantity=10" \
  -F "sku=DELL-LAT-001" > /dev/null

echo -e "${GREEN}✓ Product 3 added${NC}"

# Product 4: Desktop
echo "Adding HP Desktop..."
curl -s -X POST "$API_URL/api/admin/products" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "name=HP ProDesk 400 G6 Desktop" \
  -F "category=Desktop" \
  -F "brand=HP" \
  -F "condition=Open Box" \
  -F "description=Compact business desktop with powerful performance" \
  -F 'specifications={"Processor":"Intel i5","RAM":"8GB","Storage":"512GB SSD","Graphics":"Intel UHD"}' \
  -F "price=28000" \
  -F "original_price=38000" \
  -F "offer_percentage=26" \
  -F "stock_quantity=8" \
  -F "sku=HP-DESK-001" > /dev/null

echo -e "${GREEN}✓ Product 4 added${NC}"

# Product 5: Server
echo "Adding Dell Server..."
curl -s -X POST "$API_URL/api/admin/products" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "name=Dell PowerEdge R340 Rack Server" \
  -F "category=Server" \
  -F "brand=Dell" \
  -F "condition=New" \
  -F "description=1U Rack Server ideal for small to medium businesses" \
  -F 'specifications={"Processor":"Xeon E-2224","RAM":"16GB","Storage":"1TB HDD","Form Factor":"1U Rack"}' \
  -F "price=85000" \
  -F "stock_quantity=5" \
  -F "sku=DELL-SRV-001" > /dev/null

echo -e "${GREEN}✓ Product 5 added${NC}"

echo ""
echo "=========================================="
echo -e "${GREEN}Setup Complete! 🎉${NC}"
echo "=========================================="
echo ""
echo "Next Steps:"
echo "1. Visit store: http://localhost:3000/store"
echo "2. Admin panel: http://localhost:3000/admin"
echo "   - Username: admin"
echo "   - Password: admin123"
echo ""
echo "3. Add Razorpay keys to /app/backend/.env:"
echo "   RAZORPAY_KEY_ID=rzp_test_your_key"
echo "   RAZORPAY_KEY_SECRET=your_secret"
echo ""
echo "4. Restart backend: sudo supervisorctl restart backend"
echo ""
echo "For more details, check: /app/STORE_SETUP_GUIDE.md"
echo ""
