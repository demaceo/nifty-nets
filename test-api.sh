#!/bin/bash

echo "Testing API endpoints..."

echo "1. Testing simple API..."
curl -X GET http://localhost:3000/api/simple

echo -e "\n\n2. Testing database connection..."
curl -X GET http://localhost:3000/api/db-test

echo -e "\n\n3. Testing GET /api/websites..."
curl -X GET http://localhost:3000/api/websites

echo -e "\n\n4. Testing POST /api/websites..."
curl -X POST http://localhost:3000/api/websites \
  -H "Content-Type: application/json" \
  -H "x-admin-key: 658604870b3a9f0ea96aa289906e4df2e02e4379cc870693509191a046eeb798" \
  -d '{
    "url": "https://example.com",
    "videoSourceUrl": "https://youtube.com/watch?v=test",
    "categories": ["testing"],
    "notes": "Test website"
  }'

echo -e "\n\nTesting complete!"
