# Quick Start Guide - API Testing

## 🚀 Quick Test (5 minutes)

### Step 1: Start the API Server
```bash
cd web/fungura-api

# Install dependencies (first time only)
npm install

# Start the server
npm run start:dev
```

Wait for the message:
```
🚀 Fungura API running on http://localhost:3000/api
📚 Swagger docs at http://localhost:3000/docs
```

### Step 2: Run Tests

**Option A: Node.js Script (Recommended)**
```bash
# In a new terminal
cd web/fungura-api
node test-all-endpoints.js
```

**Option B: Bash Script (Linux/Mac/Git Bash)**
```bash
# Make executable (first time only)
chmod +x test-endpoints.sh

# Run tests
./test-endpoints.sh
```

**Option C: Manual Testing with Swagger**
Open browser: http://localhost:3000/docs

### Step 3: View Results

You should see output like:
```
━━━ Authentication Endpoints ━━━

✓ POST /auth/register
✓ POST /auth/login
✓ POST /auth/refresh
✓ POST /auth/logout

━━━ Dashboard Endpoints ━━━

✓ GET /dashboard/stats
✓ GET /dashboard/revenue
✓ GET /dashboard/order-types
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Test Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Tests: 85
Passed: 85
Failed: 0
Success Rate: 100.00%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 📋 What Gets Tested

The test scripts verify:
- ✅ All 80+ API endpoints
- ✅ Authentication flow (register, login, logout)
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Query parameters and filters
- ✅ Authorization (protected routes)
- ✅ Data relationships (orders, menu items, etc.)

## 🔧 Troubleshooting

### API Not Running
```
Error: Cannot connect to API
```
**Fix**: Start the API server with `npm run start:dev`

### Port Already in Use
```
Error: EADDRINUSE :::3000
```
**Fix**: 
```bash
# Find and kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error
```
Error: Connection refused to database
```
**Fix**: Check `.env` file has correct database credentials

### All Tests Failing
```
Failed: 85
```
**Fix**: 
1. Check API server is running
2. Verify database is accessible
3. Run database seed: `npm run seed`

## 📊 Test Coverage Summary

| Module | Endpoints | Status |
|--------|-----------|--------|
| Authentication | 4 | ✅ |
| Users | 4 | ✅ |
| Dashboard | 6 | ✅ |
| Orders | 9 | ✅ |
| Kitchen | 5 | ✅ |
| Menu | 7 | ✅ |
| Inventory | 7 | ✅ |
| Purchase Orders | 4 | ✅ |
| Reviews | 4 | ✅ |
| Notifications | 6 | ✅ |
| Messages | 4 | ✅ |
| Calendar | 4 | ✅ |
| Workers | 7 | ✅ |
| Upload | 1 | ✅ |
| **TOTAL** | **80+** | **✅ 100%** |

## 🎯 Next Steps

After confirming all endpoints work:

1. **Review API Documentation**: Check `API_COMPARISON.md`
2. **Explore Swagger UI**: http://localhost:3000/docs
3. **Frontend Integration**: Connect web app to API
4. **Build API Service**: Create `web/src/lib/api.ts`

## 📚 Additional Resources

- **Full Test Documentation**: See `TEST_README.md`
- **API Comparison**: See `API_COMPARISON.md`
- **Swagger Docs**: http://localhost:3000/docs (when server is running)
- **Backend Code**: `web/fungura-api/src/modules/`

## 💡 Tips

- Run tests after making API changes to ensure nothing broke
- Use Swagger UI for manual testing and exploration
- Check test output for detailed error messages
- Tests create and clean up their own data

## ⚡ One-Line Test Command

```bash
cd web/fungura-api && npm run start:dev & sleep 5 && node test-all-endpoints.js
```

This starts the server and runs tests automatically!
