#!/bin/bash

echo "🧪 Natal Coach API Test Script"
echo "================================"
echo ""

# Test 1: API Sağlık Kontrolü
echo "1️⃣  API Sağlık Kontrolü..."
curl -s http://localhost:3000/api/test | jq '.'
echo ""
echo ""

# Test 2: 1980'li Yıllar Testi
echo "2️⃣  1985 Doğumlu Test..."
curl -s -X POST http://localhost:3000/api/natal-chart \
  -H "Content-Type: application/json" \
  -d '{
    "year": 1985,
    "month": 12,
    "day": 25,
    "hour": 8,
    "minute": 0,
    "latitude": 39.9334,
    "longitude": 32.8597
  }' | jq -r '.data.planets | to_entries | .[] | "  \(.key): \(.value.sign)"'
echo ""
echo ""

# Test 3: 2000'li Yıllar Testi
echo "3️⃣  2000 Doğumlu Test..."
curl -s -X POST http://localhost:3000/api/natal-chart \
  -H "Content-Type: application/json" \
  -d '{
    "year": 2000,
    "month": 1,
    "day": 1,
    "hour": 0,
    "minute": 0,
    "latitude": 40.1885,
    "longitude": 29.0610
  }' | jq -r '"Yükselen: \(.data.ascendant.sign), MC: \(.data.mc.sign)"'
echo ""
echo ""

# Test 4: Hata Kontrolü (eksik parametre)
echo "4️⃣  Hata Kontrolü (eksik parametre)..."
curl -s -X POST http://localhost:3000/api/natal-chart \
  -H "Content-Type: application/json" \
  -d '{
    "year": 1990,
    "month": 5
  }' | jq '.'
echo ""

echo "✅ Test tamamlandı!"
