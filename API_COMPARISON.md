# API Endpoints Comparison

## Backend API Endpoints (Available)

### Authentication (`/api/auth`)
- ✅ `POST /api/auth/register` - Register new user
- ✅ `POST /api/auth/login` - User login
- ✅ `POST /api/auth/refresh` - Refresh access token
- ✅ `POST /api/auth/logout` - User logout

### Users (`/api/users`)
- ✅ `GET /api/users/me` - Get current user profile
- ✅ `PATCH /api/users/me` - Update current user profile
- ✅ `GET /api/users/me/settings` - Get user settings
- ✅ `PATCH /api/users/me/settings` - Update user settings

### Dashboard (`/api/dashboard`)
- ✅ `GET /api/dashboard/stats` - Get dashboard statistics
- ✅ `GET /api/dashboard/revenue?period=week|month|year` - Get revenue data
- ✅ `GET /api/dashboard/order-types` - Get order types distribution
- ✅ `GET /api/dashboard/recent-orders?limit=10` - Get recent orders
- ✅ `GET /api/dashboard/trending-menus?limit=10` - Get trending menu items
- ✅ `GET /api/dashboard/categories` - Get menu categories

### Orders (`/api/orders`)
- ✅ `GET /api/orders?status=&type=&search=&page=&limit=` - Get all orders with filters
- ✅ `GET /api/orders/stats` - Get order statistics
- ✅ `GET /api/orders/types` - Get order types
- ✅ `GET /api/orders/overview?period=week|month|year` - Get revenue overview
- ✅ `GET /api/orders/recent?limit=10` - Get recent orders
- ✅ `GET /api/orders/:id` - Get order by ID
- ✅ `POST /api/orders` - Create new order
- ✅ `PATCH /api/orders/:id/status` - Update order status
- ✅ `PATCH /api/orders/:id/assign-driver` - Assign driver to order

### Kitchen (`/api/kitchen`)
- ✅ `GET /api/kitchen/orders?status=` - Get active kitchen orders
- ✅ `GET /api/kitchen/stats` - Get kitchen statistics
- ✅ `GET /api/kitchen/drivers` - Get available drivers
- ✅ `PATCH /api/kitchen/orders/:id/status` - Update kitchen order status
- ✅ `PATCH /api/kitchen/orders/:id/driver` - Assign driver to kitchen order

### Menu (`/api/menu`)
- ✅ `GET /api/menu?category=&mealTime=&search=&sort=&page=&limit=` - Get all menu items
- ✅ `GET /api/menu/categories` - Get menu categories
- ✅ `GET /api/menu/trending?limit=10` - Get trending menu items
- ✅ `GET /api/menu/:slug` - Get menu item by slug
- ✅ `POST /api/menu` - Create menu item (Admin/Manager only)
- ✅ `PATCH /api/menu/:id` - Update menu item (Admin/Manager only)
- ✅ `DELETE /api/menu/:id` - Delete menu item (Admin/Manager only)

### Inventory (`/api/inventory`)
- ✅ `GET /api/inventory?category=&status=&search=&page=&limit=` - Get all inventory items
- ✅ `GET /api/inventory/stats` - Get inventory statistics
- ✅ `GET /api/inventory/:id` - Get inventory item by ID
- ✅ `POST /api/inventory` - Create inventory item
- ✅ `PATCH /api/inventory/:id` - Update inventory item
- ✅ `PATCH /api/inventory/:id/adjust` - Adjust stock level
- ✅ `DELETE /api/inventory/:id` - Delete inventory item

### Purchase Orders (`/api/purchase-orders`)
- ✅ `GET /api/purchase-orders?status=&page=&limit=` - Get all purchase orders
- ✅ `GET /api/purchase-orders/stats` - Get purchase order statistics
- ✅ `POST /api/purchase-orders` - Create purchase order
- ✅ `PATCH /api/purchase-orders/:id/receive` - Mark purchase order as received

### Reviews (`/api/reviews`)
- ✅ `GET /api/reviews?rating=&category=&sort=&page=&limit=` - Get all reviews
- ✅ `GET /api/reviews/stats` - Get review statistics
- ✅ `POST /api/reviews` - Create review (Authenticated)
- ✅ `DELETE /api/reviews/:id` - Delete review (Authenticated)

### Notifications (`/api/notifications`)
- ✅ `GET /api/notifications?read=&type=&page=&limit=` - Get user notifications
- ✅ `GET /api/notifications/unread-count` - Get unread notification count
- ✅ `PATCH /api/notifications/:id/read` - Mark notification as read
- ✅ `PATCH /api/notifications/read-all` - Mark all notifications as read
- ✅ `DELETE /api/notifications/:id` - Delete notification
- ✅ `POST /api/notifications/broadcast` - Broadcast notification (Admin/Manager only)

### MessagesF (`/api/messages`)
- ✅ `GET /api/messages/contacts` - Get user contacts
- ✅ `GET /api/messages/unread-count` - Get unread message count
- ✅ `GET /api/messages/:contactId` - Get conversation with contact
- ✅ `POST /api/messages/:contactId` - Send message to contact

### Calendar (`/api/calendar`)
- ✅ `GET /api/calendar/events?start=&end=` - Get calendar events
- ✅ `POST /api/calendar/events` - Create calendar event
- ✅ `PATCH /api/calendar/events/:id` - Update calendar event
- ✅ `DELETE /api/calendar/events/:id` - Delete calendar event

### Workers (`/api/workers`)
- ✅ `GET /api/workers?role=&search=&page=&limit=` - Get all workers
- ✅ `GET /api/workers/stats` - Get worker statistics
- ✅ `GET /api/workers/drivers` - Get all drivers
- ✅ `GET /api/workers/:id` - Get worker by ID
- ✅ `POST /api/workers` - Create worker (Admin/Manager only)
- ✅ `PATCH /api/workers/:id` - Update worker (Admin/Manager only)
- ✅ `DELETE /api/workers/:id` - Delete worker (Admin/Manager only)

### Upload (`/api/upload`)
- ✅ `POST /api/upload` - Upload file (Authenticated)

---

## Frontend Pages vs Backend Integration Status

### ✅ Fully Covered Pages
- **Dashboard** - All endpoints available (`/api/dashboard/*`)
- **Orders** - All endpoints available (`/api/orders/*`)
- **Kitchen** - All endpoints available (`/api/kitchen/*`)
- **Menu** - All endpoints available (`/api/menu/*`)
- **Inventory** - All endpoints available (`/api/inventory/*`)
- **Purchase Orders** - All endpoints available (`/api/purchase-orders/*`)
- **Reviews** - All endpoints available (`/api/reviews/*`)
- **Notifications** - All endpoints available (`/api/notifications/*`)
- **Messages** - All endpoints available (`/api/messages/*`)
- **Calendar** - All endpoints available (`/api/calendar/*`)
- **Workers** - All endpoints available (`/api/workers/*`)
- **Profile** - All endpoints available (`/api/users/me`)
- **Settings** - All endpoints available (`/api/users/me/settings`)
- **Auth** - All endpoints available (`/api/auth/*`)

### ⚠️ Frontend Integration Status
**Current Status**: The web app uses MOCK DATA and does NOT make actual API calls yet.

**Required Actions**:
1. Create API service layer in `web/src/lib/api.ts`
2. Replace mock data with actual API calls using fetch/axios
3. Implement authentication token management
4. Add error handling and loading states
5. Connect React Query to API endpoints

---

## Summary

✅ **Backend API**: 100% Complete - All endpoints implemented
❌ **Frontend Integration**: 0% - Using mock data only
🎯 **Next Steps**: Integrate frontend with backend API

All necessary backend endpoints are available and ready to use. The frontend just needs to be connected to consume these APIs.
