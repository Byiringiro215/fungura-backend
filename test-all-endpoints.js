#!/usr/bin/env node

/**
 * Comprehensive API Endpoint Test Script
 * Tests all available endpoints in the Fungura API
 * 
 * Usage: node test-all-endpoints.js
 * 
 * Requirements:
 * - API server running on http://localhost:3000
 * - Node.js installed
 */

const http = require('http');
const https = require('https');

// Configuration
const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const API_PREFIX = process.env.API_PREFIX || 'api';
const API_BASE = `${BASE_URL}/${API_PREFIX}`;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Test results tracking
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: [],
};

// Auth tokens (will be populated after login)
let authToken = null;
let refreshToken = null;
let userId = null;

// Test data IDs (will be populated during tests)
const testData = {
  orderId: null,
  menuId: null,
  inventoryId: null,
  purchaseOrderId: null,
  reviewId: null,
  notificationId: null,
  workerId: null,
  eventId: null,
};

/**
 * Make HTTP request
 */
function makeRequest(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path.startsWith('http') ? path : `${API_BASE}${path}`);
    const isHttps = url.protocol === 'https:';
    const lib = isHttps ? https : http;

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers,
      },
    };

    const req = lib.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null,
          };
          resolve(response);
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body,
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Log test result
 */
function logTest(name, passed, message = '', response = null) {
  results.total++;
  if (passed) {
    results.passed++;
    console.log(`${colors.green}✓${colors.reset} ${name}`);
  } else {
    results.failed++;
    console.log(`${colors.red}✗${colors.reset} ${name}`);
    if (message) console.log(`  ${colors.yellow}${message}${colors.reset}`);
    if (response) {
      console.log(`  Status: ${response.status}`);
      console.log(`  Body: ${JSON.stringify(response.body, null, 2)}`);
    }
  }
  results.tests.push({ name, passed, message });
}

/**
 * Test endpoint
 */
async function testEndpoint(name, method, path, expectedStatus, data = null, requiresAuth = false) {
  try {
    const headers = {};
    if (requiresAuth && authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await makeRequest(method, path, data, headers);
    const passed = response.status === expectedStatus;
    
    if (!passed) {
      logTest(name, false, `Expected ${expectedStatus}, got ${response.status}`, response);
    } else {
      logTest(name, true);
    }

    return response;
  } catch (error) {
    logTest(name, false, error.message);
    return null;
  }
}

/**
 * Print section header
 */
function printSection(title) {
  console.log(`\n${colors.bright}${colors.cyan}━━━ ${title} ━━━${colors.reset}\n`);
}

/**
 * Print summary
 */
function printSummary() {
  console.log(`\n${colors.bright}${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bright}Test Summary${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`Total Tests: ${results.total}`);
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
  console.log(`${colors.yellow}Skipped: ${results.skipped}${colors.reset}`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(2)}%`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
}

/**
 * Main test suite
 */
async function runTests() {
  console.log(`${colors.bright}${colors.blue}Fungura API Endpoint Test Suite${colors.reset}`);
  console.log(`Testing API at: ${API_BASE}\n`);

  // ============================================
  // Authentication Tests
  // ============================================
  printSection('Authentication Endpoints');

  // Register
  const registerData = {
    email: `test${Date.now()}@example.com`,
    password: 'Test123!@#',
    name: 'Test User',
  };
  const registerRes = await testEndpoint(
    'POST /auth/register',
    'POST',
    '/auth/register',
    201,
    registerData
  );

  if (registerRes && registerRes.body && registerRes.body.data) {
    authToken = registerRes.body.data.accessToken;
    refreshToken = registerRes.body.data.refreshToken;
    userId = registerRes.body.data.user?.id;
  }

  // Login
  const loginRes = await testEndpoint(
    'POST /auth/login',
    'POST',
    '/auth/login',
    200,
    {
      email: registerData.email,
      password: registerData.password,
    }
  );

  if (loginRes && loginRes.body && loginRes.body.data && !authToken) {
    authToken = loginRes.body.data.accessToken;
    refreshToken = loginRes.body.data.refreshToken;
    userId = loginRes.body.data.user?.id;
  }

  // Refresh Token
  if (refreshToken && userId) {
    await testEndpoint(
      'POST /auth/refresh',
      'POST',
      '/auth/refresh',
      200,
      { refreshToken, userId }
    );
  }

  // Logout
  await testEndpoint('POST /auth/logout', 'POST', '/auth/logout', 200, null, true);

  // ============================================
  // User Endpoints
  // ============================================
  printSection('User Endpoints');

  await testEndpoint('GET /users/me', 'GET', '/users/me', 200, null, true);
  await testEndpoint(
    'PATCH /users/me',
    'PATCH',
    '/users/me',
    200,
    { name: 'Updated Name' },
    true
  );
  await testEndpoint('GET /users/me/settings', 'GET', '/users/me/settings', 200, null, true);
  await testEndpoint(
    'PATCH /users/me/settings',
    'PATCH',
    '/users/me/settings',
    200,
    { theme: 'dark', language: 'en' },
    true
  );

  // ============================================
  // Dashboard Endpoints
  // ============================================
  printSection('Dashboard Endpoints');

  await testEndpoint('GET /dashboard/stats', 'GET', '/dashboard/stats', 200, null, true);
  await testEndpoint('GET /dashboard/revenue', 'GET', '/dashboard/revenue?period=month', 200, null, true);
  await testEndpoint('GET /dashboard/order-types', 'GET', '/dashboard/order-types', 200, null, true);
  await testEndpoint('GET /dashboard/recent-orders', 'GET', '/dashboard/recent-orders?limit=5', 200, null, true);
  await testEndpoint('GET /dashboard/trending-menus', 'GET', '/dashboard/trending-menus?limit=5', 200, null, true);
  await testEndpoint('GET /dashboard/categories', 'GET', '/dashboard/categories', 200, null, true);

  // ============================================
  // Order Endpoints
  // ============================================
  printSection('Order Endpoints');

  await testEndpoint('GET /orders', 'GET', '/orders', 200, null, true);
  await testEndpoint('GET /orders with filters', 'GET', '/orders?status=On Process&type=Dine-In&page=1&limit=10', 200, null, true);
  await testEndpoint('GET /orders/stats', 'GET', '/orders/stats', 200, null, true);
  await testEndpoint('GET /orders/types', 'GET', '/orders/types', 200, null, true);
  await testEndpoint('GET /orders/overview', 'GET', '/orders/overview?period=week', 200, null, true);
  await testEndpoint('GET /orders/recent', 'GET', '/orders/recent?limit=5', 200, null, true);

  // Create Order
  const createOrderRes = await testEndpoint(
    'POST /orders',
    'POST',
    '/orders',
    201,
    {
      customer: 'John Doe',
      type: 'Dine-In',
      tableNumber: '12',
      items: [
        { name: 'Pasta', qty: 2, price: 15.99, notes: 'Extra cheese' },
        { name: 'Salad', qty: 1, price: 8.99 },
      ],
    },
    true
  );

  if (createOrderRes && createOrderRes.body && createOrderRes.body.data) {
    testData.orderId = createOrderRes.body.data.id;
  }

  // Get Order by ID
  if (testData.orderId) {
    await testEndpoint(`GET /orders/${testData.orderId}`, 'GET', `/orders/${testData.orderId}`, 200, null, true);
    await testEndpoint(
      `PATCH /orders/${testData.orderId}/status`,
      'PATCH',
      `/orders/${testData.orderId}/status`,
      200,
      { status: 'On Process' },
      true
    );
    await testEndpoint(
      `PATCH /orders/${testData.orderId}/assign-driver`,
      'PATCH',
      `/orders/${testData.orderId}/assign-driver`,
      200,
      { driverId: 'driver-123', driverName: 'John Driver' },
      true
    );
  }

  // ============================================
  // Kitchen Endpoints
  // ============================================
  printSection('Kitchen Endpoints');

  await testEndpoint('GET /kitchen/orders', 'GET', '/kitchen/orders', 200, null, true);
  await testEndpoint('GET /kitchen/orders with filter', 'GET', '/kitchen/orders?status=preparing', 200, null, true);
  await testEndpoint('GET /kitchen/stats', 'GET', '/kitchen/stats', 200, null, true);
  await testEndpoint('GET /kitchen/drivers', 'GET', '/kitchen/drivers', 200, null, true);

  if (testData.orderId) {
    await testEndpoint(
      `PATCH /kitchen/orders/${testData.orderId}/status`,
      'PATCH',
      `/kitchen/orders/${testData.orderId}/status`,
      200,
      { status: 'ready' },
      true
    );
    
    // Get a real driver ID from the drivers list
    const driversRes = await makeRequest('GET', '/kitchen/drivers', null, {
      Authorization: `Bearer ${authToken}`,
    });
    let driverId = null;
    if (driversRes.body && driversRes.body.data && driversRes.body.data.length > 0) {
      driverId = driversRes.body.data[0].id;
    }
    
    if (driverId) {
      await testEndpoint(
        `PATCH /kitchen/orders/${testData.orderId}/driver`,
        'PATCH',
        `/kitchen/orders/${testData.orderId}/driver`,
        200,
        { driverId },
        true
      );
    }
  }

  // ============================================
  // Menu Endpoints
  // ============================================
  printSection('Menu Endpoints');

  await testEndpoint('GET /menu', 'GET', '/menu', 200, null, false);
  await testEndpoint('GET /menu with filters', 'GET', '/menu?category=pasta&mealTime=dinner&page=1&limit=10', 200, null, false);
  await testEndpoint('GET /menu/categories', 'GET', '/menu/categories', 200, null, false);
  await testEndpoint('GET /menu/trending', 'GET', '/menu/trending?limit=5', 200, null, false);

  // Create Menu Item
  const createMenuRes = await testEndpoint(
    'POST /menu',
    'POST',
    '/menu',
    201,
    {
      name: 'Test Pasta Dish',
      description: 'Delicious test pasta',
      price: 19.99,
      category: 'pasta',
      mealTime: 'dinner',
      image: 'https://example.com/pasta.jpg',
    },
    true
  );

  if (createMenuRes && createMenuRes.body && createMenuRes.body.data) {
    testData.menuId = createMenuRes.body.data.id;
    const slug = createMenuRes.body.data.slug;

    if (slug) {
      await testEndpoint(`GET /menu/${slug}`, 'GET', `/menu/${slug}`, 200, null, false);
    }

    if (testData.menuId) {
      await testEndpoint(
        `PATCH /menu/${testData.menuId}`,
        'PATCH',
        `/menu/${testData.menuId}`,
        200,
        { price: 21.99, description: 'Updated description' },
        true
      );
      await testEndpoint(`DELETE /menu/${testData.menuId}`, 'DELETE', `/menu/${testData.menuId}`, 200, null, true);
    }
  }

  // ============================================
  // Inventory Endpoints
  // ============================================
  printSection('Inventory Endpoints');

  await testEndpoint('GET /inventory', 'GET', '/inventory', 200, null, true);
  await testEndpoint('GET /inventory with filters', 'GET', '/inventory?category=vegetables&status=low&page=1&limit=10', 200, null, true);
  await testEndpoint('GET /inventory/stats', 'GET', '/inventory/stats', 200, null, true);

  // Create Inventory Item
  const createInventoryRes = await testEndpoint(
    'POST /inventory',
    'POST',
    '/inventory',
    201,
    {
      name: 'Test Tomatoes',
      category: 'vegetables',
      stock: 50,
      unit: 'kg',
      reorderLevel: 20,
      supplier: 'Fresh Farms',
    },
    true
  );

  if (createInventoryRes && createInventoryRes.body && createInventoryRes.body.data) {
    testData.inventoryId = createInventoryRes.body.data.id;

    if (testData.inventoryId) {
      await testEndpoint(`GET /inventory/${testData.inventoryId}`, 'GET', `/inventory/${testData.inventoryId}`, 200, null, true);
      await testEndpoint(
        `PATCH /inventory/${testData.inventoryId}`,
        'PATCH',
        `/inventory/${testData.inventoryId}`,
        200,
        { stock: 45, reorderLevel: 15 },
        true
      );
      await testEndpoint(
        `PATCH /inventory/${testData.inventoryId}/adjust`,
        'PATCH',
        `/inventory/${testData.inventoryId}/adjust`,
        200,
        { adjustment: -10 },
        true
      );
      await testEndpoint(`DELETE /inventory/${testData.inventoryId}`, 'DELETE', `/inventory/${testData.inventoryId}`, 200, null, true);
    }
  }

  // ============================================
  // Purchase Order Endpoints
  // ============================================
  printSection('Purchase Order Endpoints');

  await testEndpoint('GET /purchase-orders', 'GET', '/purchase-orders', 200, null, true);
  await testEndpoint('GET /purchase-orders with filter', 'GET', '/purchase-orders?status=pending&page=1&limit=10', 200, null, true);
  await testEndpoint('GET /purchase-orders/stats', 'GET', '/purchase-orders/stats', 200, null, true);

  // Create Purchase Order
  const createPORes = await testEndpoint(
    'POST /purchase-orders',
    'POST',
    '/purchase-orders',
    201,
    {
      item: 'Tomatoes',
      itemCategory: 'Vegetables',
      vendor: 'Fresh Farms',
      unitPrice: 2.5,
      qty: 100,
      total: 250,
      arrivalDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    true
  );

  if (createPORes && createPORes.body && createPORes.body.data) {
    testData.purchaseOrderId = createPORes.body.data.id;

    if (testData.purchaseOrderId) {
      await testEndpoint(
        `PATCH /purchase-orders/${testData.purchaseOrderId}/receive`,
        'PATCH',
        `/purchase-orders/${testData.purchaseOrderId}/receive`,
        200,
        null,
        true
      );
    }
  }

  // ============================================
  // Review Endpoints
  // ============================================
  printSection('Review Endpoints');

  await testEndpoint('GET /reviews', 'GET', '/reviews', 200, null, false);
  await testEndpoint('GET /reviews with filters', 'GET', '/reviews?rating=5&category=food&sort=recent&page=1&limit=10', 200, null, false);
  await testEndpoint('GET /reviews/stats', 'GET', '/reviews/stats', 200, null, false);

  // Create Review
  const createReviewRes = await testEndpoint(
    'POST /reviews',
    'POST',
    '/reviews',
    201,
    {
      menuItemName: 'Classic Italian Penne',
      category: 'Pasta',
      rating: 5,
      reviewCount: 1,
      overallRating: 5,
      text: 'Excellent food and service!',
      author: 'Test User',
    },
    true
  );

  if (createReviewRes && createReviewRes.body && createReviewRes.body.data) {
    testData.reviewId = createReviewRes.body.data.id;

    if (testData.reviewId) {
      await testEndpoint(`DELETE /reviews/${testData.reviewId}`, 'DELETE', `/reviews/${testData.reviewId}`, 200, null, true);
    }
  }

  // ============================================
  // Notification Endpoints
  // ============================================
  printSection('Notification Endpoints');

  await testEndpoint('GET /notifications', 'GET', '/notifications', 200, null, true);
  await testEndpoint('GET /notifications with filters', 'GET', '/notifications?read=false&type=order&page=1&limit=10', 200, null, true);
  await testEndpoint('GET /notifications/unread-count', 'GET', '/notifications/unread-count', 200, null, true);

  // Broadcast Notification (Admin/Manager only)
  const broadcastRes = await testEndpoint(
    'POST /notifications/broadcast',
    'POST',
    '/notifications/broadcast',
    201,
    {
      title: 'Test Notification',
      message: 'This is a test broadcast notification',
      type: 'info',
    },
    true
  );

  if (broadcastRes && broadcastRes.body && broadcastRes.body.data && broadcastRes.body.data.id) {
    testData.notificationId = broadcastRes.body.data.id;
  }

  // Get first notification from list for testing
  const notificationsRes = await makeRequest('GET', '/notifications', null, {
    Authorization: `Bearer ${authToken}`,
  });
  if (notificationsRes.body && notificationsRes.body.data && notificationsRes.body.data.data && notificationsRes.body.data.data.length > 0) {
    testData.notificationId = notificationsRes.body.data.data[0].id;
  }

  if (testData.notificationId) {
    await testEndpoint(
      `PATCH /notifications/${testData.notificationId}/read`,
      'PATCH',
      `/notifications/${testData.notificationId}/read`,
      200,
      null,
      true
    );
  }

  await testEndpoint('PATCH /notifications/read-all', 'PATCH', '/notifications/read-all', 200, null, true);

  if (testData.notificationId) {
    await testEndpoint(`DELETE /notifications/${testData.notificationId}`, 'DELETE', `/notifications/${testData.notificationId}`, 200, null, true);
  }

  // ============================================
  // Message Endpoints
  // ============================================
  printSection('Message Endpoints');

  await testEndpoint('GET /messages/contacts', 'GET', '/messages/contacts', 200, null, true);
  await testEndpoint('GET /messages/unread-count', 'GET', '/messages/unread-count', 200, null, true);

  // For testing conversation and sending messages, we need a contact ID
  // Using a dummy ID for demonstration
  const contactId = 'contact-123';
  await testEndpoint(`GET /messages/${contactId}`, 'GET', `/messages/${contactId}`, 200, null, true);
  await testEndpoint(
    `POST /messages/${contactId}`,
    'POST',
    `/messages/${contactId}`,
    201,
    { text: 'Hello, this is a test message!' },
    true
  );

  // ============================================
  // Calendar Endpoints
  // ============================================
  printSection('Calendar Endpoints');

  const startDate = new Date().toISOString();
  const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  await testEndpoint('GET /calendar/events', 'GET', `/calendar/events?start=${startDate}&end=${endDate}`, 200, null, true);

  // Create Calendar Event
  const createEventRes = await testEndpoint(
    'POST /calendar/events',
    'POST',
    '/calendar/events',
    201,
    {
      title: 'Team Meeting',
      description: 'Weekly team sync',
      startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
    },
    true
  );

  if (createEventRes && createEventRes.body && createEventRes.body.data) {
    testData.eventId = createEventRes.body.data.id;

    if (testData.eventId) {
      await testEndpoint(
        `PATCH /calendar/events/${testData.eventId}`,
        'PATCH',
        `/calendar/events/${testData.eventId}`,
        200,
        { title: 'Updated Team Meeting', description: 'Updated description' },
        true
      );
      await testEndpoint(`DELETE /calendar/events/${testData.eventId}`, 'DELETE', `/calendar/events/${testData.eventId}`, 200, null, true);
    }
  }

  // ============================================
  // Worker Endpoints
  // ============================================
  printSection('Worker Endpoints');

  await testEndpoint('GET /workers', 'GET', '/workers', 200, null, true);
  await testEndpoint('GET /workers with filters', 'GET', '/workers?role=Kitchen&search=john&page=1&limit=10', 200, null, true);
  await testEndpoint('GET /workers/stats', 'GET', '/workers/stats', 200, null, true);
  await testEndpoint('GET /workers/drivers', 'GET', '/workers/drivers', 200, null, true);

  // Create Worker
  const createWorkerRes = await testEndpoint(
    'POST /workers',
    'POST',
    '/workers',
    201,
    {
      name: 'John Chef',
      email: `chef${Date.now()}@example.com`,
      role: 'Kitchen',
      phone: '+1234567890',
    },
    true
  );

  if (createWorkerRes && createWorkerRes.body && createWorkerRes.body.data) {
    testData.workerId = createWorkerRes.body.data.id;

    if (testData.workerId) {
      await testEndpoint(`GET /workers/${testData.workerId}`, 'GET', `/workers/${testData.workerId}`, 200, null, true);
      await testEndpoint(
        `PATCH /workers/${testData.workerId}`,
        'PATCH',
        `/workers/${testData.workerId}`,
        200,
        { phone: '+0987654321' },
        true
      );
      await testEndpoint(`DELETE /workers/${testData.workerId}`, 'DELETE', `/workers/${testData.workerId}`, 200, null, true);
    }
  }

  // ============================================
  // Upload Endpoint
  // ============================================
  printSection('Upload Endpoint');

  // Note: File upload requires multipart/form-data which is complex with raw http module
  // This is a placeholder test - actual file upload would need proper multipart handling
  console.log(`${colors.yellow}⊘${colors.reset} POST /upload (Requires multipart/form-data - skipped)`);
  results.skipped++;

  // ============================================
  // Print Summary
  // ============================================
  printSummary();

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch((error) => {
  console.error(`${colors.red}Fatal Error:${colors.reset}`, error);
  process.exit(1);
});
