# API Testing Guide

This directory contains comprehensive testing scripts for all Fungura API endpoints.

## Available Test Scripts

### 1. Node.js Test Script (Recommended)
**File**: `test-all-endpoints.js`

Comprehensive test suite that tests all API endpoints with detailed output.

**Features**:
- Tests all 80+ endpoints
- Creates test data and cleans up
- Colored console output
- Detailed error reporting
- Success rate calculation

**Requirements**:
- Node.js installed
- API server running

**Usage**:
```bash
# Make sure API is running first
cd web/fungura-api
npm run start:dev

# In another terminal, run tests
node test-all-endpoints.js

# Or with custom API URL
API_URL=http://localhost:4000 node test-all-endpoints.js
```

### 2. Bash Test Script (Quick Validation)
**File**: `test-endpoints.sh`

Lightweight bash script for quick endpoint validation using curl.

**Features**:
- Fast execution
- No dependencies except curl
- Optional jq for pretty JSON
- Good for CI/CD pipelines

**Requirements**:
- bash
- curl
- jq (optional, for pretty output)

**Usage**:
```bash
# Make executable
chmod +x test-endpoints.sh

# Run tests
./test-endpoints.sh

# Or with custom API URL
API_URL=http://localhost:4000 ./test-endpoints.sh
```

## Test Coverage

### ✅ Tested Endpoints (80+ endpoints)

#### Authentication (4 endpoints)
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout

#### Users (4 endpoints)
- GET /api/users/me
- PATCH /api/users/me
- GET /api/users/me/settings
- PATCH /api/users/me/settings

#### Dashboard (6 endpoints)
- GET /api/dashboard/stats
- GET /api/dashboard/revenue
- GET /api/dashboard/order-types
- GET /api/dashboard/recent-orders
- GET /api/dashboard/trending-menus
- GET /api/dashboard/categories

#### Orders (9 endpoints)
- GET /api/orders
- GET /api/orders/stats
- GET /api/orders/types
- GET /api/orders/overview
- GET /api/orders/recent
- GET /api/orders/:id
- POST /api/orders
- PATCH /api/orders/:id/status
- PATCH /api/orders/:id/assign-driver

#### Kitchen (5 endpoints)
- GET /api/kitchen/orders
- GET /api/kitchen/stats
- GET /api/kitchen/drivers
- PATCH /api/kitchen/orders/:id/status
- PATCH /api/kitchen/orders/:id/driver

#### Menu (7 endpoints)
- GET /api/menu
- GET /api/menu/categories
- GET /api/menu/trending
- GET /api/menu/:slug
- POST /api/menu
- PATCH /api/menu/:id
- DELETE /api/menu/:id

#### Inventory (7 endpoints)
- GET /api/inventory
- GET /api/inventory/stats
- GET /api/inventory/:id
- POST /api/inventory
- PATCH /api/inventory/:id
- PATCH /api/inventory/:id/adjust
- DELETE /api/inventory/:id

#### Purchase Orders (4 endpoints)
- GET /api/purchase-orders
- GET /api/purchase-orders/stats
- POST /api/purchase-orders
- PATCH /api/purchase-orders/:id/receive

#### Reviews (4 endpoints)
- GET /api/reviews
- GET /api/reviews/stats
- POST /api/reviews
- DELETE /api/reviews/:id

#### Notifications (6 endpoints)
- GET /api/notifications
- GET /api/notifications/unread-count
- PATCH /api/notifications/:id/read
- PATCH /api/notifications/read-all
- DELETE /api/notifications/:id
- POST /api/notifications/broadcast

#### Messages (4 endpoints)
- GET /api/messages/contacts
- GET /api/messages/unread-count
- GET /api/messages/:contactId
- POST /api/messages/:contactId

#### Calendar (4 endpoints)
- GET /api/calendar/events
- POST /api/calendar/events
- PATCH /api/calendar/events/:id
- DELETE /api/calendar/events/:id

#### Workers (7 endpoints)
- GET /api/workers
- GET /api/workers/stats
- GET /api/workers/drivers
- GET /api/workers/:id
- POST /api/workers
- PATCH /api/workers/:id
- DELETE /api/workers/:id

#### Upload (1 endpoint)
- POST /api/upload

## Running the API Server

Before running tests, ensure the API server is running:

```bash
# Install dependencies
cd web/fungura-api
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations (if applicable)
npm run migration:run

# Seed database with test data
npm run seed

# Start the server
npm run start:dev
```

The API will be available at `http://localhost:3000/api`

## Environment Variables

You can customize the test environment:

```bash
# API URL (default: http://localhost:3000)
export API_URL=http://localhost:4000

# API Prefix (default: api)
export API_PREFIX=api

# Run tests
node test-all-endpoints.js
```

## Test Output

### Successful Test
```
✓ GET /dashboard/stats
```

### Failed Test
```
✗ GET /orders/:id (Expected 200, got 404)
  Status: 404
  Body: {
    "statusCode": 404,
    "message": "Order not found"
  }
```

### Summary
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Test Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Tests: 85
Passed: 82
Failed: 3
Skipped: 0
Success Rate: 96.47%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Troubleshooting

### Connection Refused
```
Error: Cannot connect to API at http://localhost:3000
```
**Solution**: Make sure the API server is running with `npm run start:dev`

### Authentication Errors
```
✗ GET /users/me (Expected 200, got 401)
```
**Solution**: Check that the authentication flow (register/login) is working correctly

### Database Errors
```
✗ POST /orders (Expected 201, got 500)
```
**Solution**: 
- Check database connection in `.env`
- Run migrations: `npm run migration:run`
- Seed database: `npm run seed`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: 
- Stop other processes using port 3000
- Or change the port in `.env`: `PORT=4000`

## CI/CD Integration

### GitHub Actions Example
```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd web/fungura-api
          npm install
      
      - name: Run migrations
        run: |
          cd web/fungura-api
          npm run migration:run
      
      - name: Start API server
        run: |
          cd web/fungura-api
          npm run start:dev &
          sleep 10
      
      - name: Run API tests
        run: |
          cd web/fungura-api
          node test-all-endpoints.js
```

## Manual Testing with Swagger

The API also provides Swagger documentation for manual testing:

1. Start the API server: `npm run start:dev`
2. Open browser: `http://localhost:3000/docs`
3. Use the interactive Swagger UI to test endpoints

## Next Steps

After verifying all endpoints work:

1. **Frontend Integration**: Connect the web app to use these APIs
2. **Create API Service Layer**: Build `web/src/lib/api.ts` with typed API calls
3. **Add React Query**: Implement data fetching with React Query
4. **Error Handling**: Add proper error boundaries and toast notifications
5. **Authentication Flow**: Implement login/logout with token management

See `API_COMPARISON.md` for detailed endpoint documentation and integration status.
