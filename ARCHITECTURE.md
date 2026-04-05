# Fungura API Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│                     web/src/ - Port 5173                        │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │Dashboard │  │  Orders  │  │ Kitchen  │  │   Menu   │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │Inventory │  │ Reviews  │  │ Workers  │  │ Messages │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                  │
│              ⚠️  Currently using MOCK DATA                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              │ (Not Connected Yet)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend API (NestJS)                          │
│                web/fungura-api/ - Port 3000                     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                   API Gateway                           │   │
│  │              http://localhost:3000/api                  │   │
│  │                                                          │   │
│  │  • CORS Enabled                                         │   │
│  │  • JWT Authentication                                   │   │
│  │  • Request Validation                                   │   │
│  │  • Error Handling                                       │   │
│  │  • Logging & Monitoring                                 │   │
│  └────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌───────────────────────────┴────────────────────────────┐   │
│  │                    Controllers                          │   │
│  │                                                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │  │   Auth   │  │  Orders  │  │ Kitchen  │            │   │
│  │  └──────────┘  └──────────┘  └──────────┘            │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │  │   Menu   │  │Inventory │  │ Reviews  │            │   │
│  │  └──────────┘  └──────────┘  └──────────┘            │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │  │ Workers  │  │ Messages │  │ Calendar │            │   │
│  │  └──────────┘  └──────────┘  └──────────┘            │   │
│  └────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌───────────────────────────┴────────────────────────────┐   │
│  │                     Services                            │   │
│  │                                                          │   │
│  │  • Business Logic                                       │   │
│  │  • Data Validation                                      │   │
│  │  • Transaction Management                               │   │
│  │  • External API Integration                             │   │
│  └────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌───────────────────────────┴────────────────────────────┐   │
│  │                   Repositories                          │   │
│  │                                                          │   │
│  │  • TypeORM Entities                                     │   │
│  │  • Database Queries                                     │   │
│  │  • Data Persistence                                     │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ TypeORM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Database (PostgreSQL)                         │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  users   │  │  orders  │  │   menu   │  │inventory │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ workers  │  │ reviews  │  │ messages │  │ calendar │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

## API Modules

### 1. Authentication Module
```
/api/auth
├── POST   /register      - User registration
├── POST   /login         - User login
├── POST   /refresh       - Refresh access token
└── POST   /logout        - User logout
```

### 2. User Module
```
/api/users
├── GET    /me            - Get current user
├── PATCH  /me            - Update profile
├── GET    /me/settings   - Get settings
└── PATCH  /me/settings   - Update settings
```

### 3. Dashboard Module
```
/api/dashboard
├── GET    /stats         - Dashboard statistics
├── GET    /revenue       - Revenue data
├── GET    /order-types   - Order type distribution
├── GET    /recent-orders - Recent orders
├── GET    /trending-menus- Trending menu items
└── GET    /categories    - Menu categories
```

### 4. Orders Module
```
/api/orders
├── GET    /              - List all orders (with filters)
├── GET    /stats         - Order statistics
├── GET    /types         - Order types
├── GET    /overview      - Revenue overview
├── GET    /recent        - Recent orders
├── GET    /:id           - Get order by ID
├── POST   /              - Create new order
├── PATCH  /:id/status    - Update order status
└── PATCH  /:id/assign-driver - Assign driver
```

### 5. Kitchen Module
```
/api/kitchen
├── GET    /orders        - Active kitchen orders
├── GET    /stats         - Kitchen statistics
├── GET    /drivers       - Available drivers
├── PATCH  /orders/:id/status - Update kitchen status
└── PATCH  /orders/:id/driver - Assign driver
```

### 6. Menu Module
```
/api/menu
├── GET    /              - List menu items (with filters)
├── GET    /categories    - Menu categories
├── GET    /trending      - Trending items
├── GET    /:slug         - Get item by slug
├── POST   /              - Create menu item
├── PATCH  /:id           - Update menu item
└── DELETE /:id           - Delete menu item
```

### 7. Inventory Module
```
/api/inventory
├── GET    /              - List inventory (with filters)
├── GET    /stats         - Inventory statistics
├── GET    /:id           - Get item by ID
├── POST   /              - Create inventory item
├── PATCH  /:id           - Update item
├── PATCH  /:id/adjust    - Adjust stock level
└── DELETE /:id           - Delete item
```

### 8. Purchase Orders Module
```
/api/purchase-orders
├── GET    /              - List purchase orders
├── GET    /stats         - PO statistics
├── POST   /              - Create purchase order
└── PATCH  /:id/receive   - Mark as received
```

### 9. Reviews Module
```
/api/reviews
├── GET    /              - List reviews (with filters)
├── GET    /stats         - Review statistics
├── POST   /              - Create review
└── DELETE /:id           - Delete review
```

### 10. Notifications Module
```
/api/notifications
├── GET    /              - List notifications
├── GET    /unread-count  - Unread count
├── PATCH  /:id/read      - Mark as read
├── PATCH  /read-all      - Mark all as read
├── DELETE /:id           - Delete notification
└── POST   /broadcast     - Broadcast notification
```

### 11. Messages Module
```
/api/messages
├── GET    /contacts      - Get contacts
├── GET    /unread-count  - Unread count
├── GET    /:contactId    - Get conversation
└── POST   /:contactId    - Send message
```

### 12. Calendar Module
```
/api/calendar
├── GET    /events        - List events
├── POST   /events        - Create event
├── PATCH  /events/:id    - Update event
└── DELETE /events/:id    - Delete event
```

### 13. Workers Module
```
/api/workers
├── GET    /              - List workers (with filters)
├── GET    /stats         - Worker statistics
├── GET    /drivers       - List drivers
├── GET    /:id           - Get worker by ID
├── POST   /              - Create worker
├── PATCH  /:id           - Update worker
└── DELETE /:id           - Delete worker
```

### 14. Upload Module
```
/api/upload
└── POST   /              - Upload file
```

## Authentication Flow

```
┌──────────┐                                    ┌──────────┐
│  Client  │                                    │   API    │
└────┬─────┘                                    └────┬─────┘
     │                                                │
     │  1. POST /api/auth/register                   │
     │  { email, password, name, role }              │
     ├──────────────────────────────────────────────>│
     │                                                │
     │  2. { accessToken, refreshToken, user }       │
     │<──────────────────────────────────────────────┤
     │                                                │
     │  3. Store tokens in localStorage/cookies      │
     │                                                │
     │  4. GET /api/orders                           │
     │  Authorization: Bearer {accessToken}          │
     ├──────────────────────────────────────────────>│
     │                                                │
     │  5. Verify JWT token                          │
     │                                                │
     │  6. { data: [...orders] }                     │
     │<──────────────────────────────────────────────┤
     │                                                │
     │  7. Token expires (401 Unauthorized)          │
     │<──────────────────────────────────────────────┤
     │                                                │
     │  8. POST /api/auth/refresh                    │
     │  { refreshToken, userId }                     │
     ├──────────────────────────────────────────────>│
     │                                                │
     │  9. { accessToken, refreshToken }             │
     │<──────────────────────────────────────────────┤
     │                                                │
     │  10. Retry original request with new token    │
     │                                                │
```

## Request/Response Flow

```
┌─────────┐     ┌──────────┐     ┌─────────┐     ┌──────────┐     ┌──────────┐
│ Client  │────>│  Guard   │────>│ Controller│────>│ Service  │────>│Repository│
└─────────┘     └──────────┘     └─────────┘     └──────────┘     └──────────┘
     │               │                  │               │                │
     │               │                  │               │                │
     │          Verify JWT         Route to        Business         Database
     │          Check Roles        Handler          Logic            Query
     │               │                  │               │                │
     │               │                  │               │                ▼
     │               │                  │               │          ┌──────────┐
     │               │                  │               │          │PostgreSQL│
     │               │                  │               │          └──────────┘
     │               │                  │               │                │
     │               │                  │               │<───────────────┘
     │               │                  │<──────────────┤
     │               │<─────────────────┤               │
     │<──────────────┤                  │               │
     │               │                  │               │
     │          Response with data      │               │
     │                                  │               │
```

## Technology Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (Passport)
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, Throttling

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Routing**: React Router
- **State Management**: React Query (planned)
- **UI Library**: Tailwind CSS + shadcn/ui
- **Build Tool**: Vite
- **i18n**: react-i18next

### Database Schema
```
users
├── id (PK)
├── email (unique)
├── password (hashed)
├── name
├── role (admin/manager/staff)
├── settings (JSON)
└── timestamps

orders
├── id (PK)
├── customer
├── type (dine-in/takeaway/delivery)
├── status
├── items (JSON)
├── total
├── userId (FK)
└── timestamps

menu
├── id (PK)
├── name
├── slug (unique)
├── description
├── price
├── category
├── image
└── timestamps

inventory
├── id (PK)
├── name
├── category
├── stock
├── unit
├── reorderLevel
└── timestamps

workers
├── id (PK)
├── name
├── email
├── role
├── phone
├── shift
└── timestamps

reviews
├── id (PK)
├── rating
├── comment
├── category
├── userId (FK)
└── timestamps

notifications
├── id (PK)
├── title
├── message
├── type
├── read
├── userId (FK)
└── timestamps

messages
├── id (PK)
├── text
├── senderId (FK)
├── receiverId (FK)
└── timestamps

calendar_events
├── id (PK)
├── title
├── description
├── start
├── end
├── type
├── userId (FK)
└── timestamps
```

## Security Features

1. **Authentication**
   - JWT-based authentication
   - Refresh token rotation
   - Password hashing (bcrypt)

2. **Authorization**
   - Role-based access control (RBAC)
   - Route guards
   - Resource ownership validation

3. **Security Headers**
   - Helmet.js for HTTP headers
   - CORS configuration
   - Rate limiting/throttling

4. **Input Validation**
   - DTO validation with class-validator
   - SQL injection prevention (TypeORM)
   - XSS protection

5. **Error Handling**
   - Global exception filter
   - Sanitized error messages
   - Logging and monitoring

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Production                              │
│                                                              │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │   Frontend   │         │   Backend    │                 │
│  │   (Vercel)   │────────>│   (Heroku)   │                 │
│  │  Port 443    │  HTTPS  │  Port 443    │                 │
│  └──────────────┘         └──────┬───────┘                 │
│                                   │                          │
│                                   │                          │
│                            ┌──────▼───────┐                 │
│                            │  PostgreSQL  │                 │
│                            │   (Heroku)   │                 │
│                            └──────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

## Current Status

✅ **Backend**: 100% Complete - All endpoints implemented
❌ **Frontend**: 0% Integration - Using mock data
⏳ **Next**: Connect frontend to backend API

## Testing

- **Unit Tests**: Jest
- **E2E Tests**: Supertest
- **API Tests**: Custom test scripts (Node.js & Bash)
- **Manual Tests**: Swagger UI

Run tests:
```bash
npm run test:endpoints
```
