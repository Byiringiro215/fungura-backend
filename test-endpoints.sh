#!/bin/bash

# Fungura API Endpoint Test Script (Bash Version)
# Simple curl-based testing for quick validation
#
# Usage: ./test-endpoints.sh
# Requirements: curl, jq (optional for pretty JSON)

set -e

# Configuration
API_URL="${API_URL:-http://localhost:3000}"
API_PREFIX="${API_PREFIX:-api}"
BASE_URL="$API_URL/$API_PREFIX"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Counters
TOTAL=0
PASSED=0
FAILED=0

# Auth tokens
ACCESS_TOKEN=""
REFRESH_TOKEN=""
USER_ID=""

# Test IDs
ORDER_ID=""
MENU_ID=""
INVENTORY_ID=""

# Check if jq is available
if command -v jq &> /dev/null; then
    HAS_JQ=true
else
    HAS_JQ=false
    echo -e "${YELLOW}Note: jq not found. Install jq for prettier JSON output${NC}"
fi

# Function to make API request
api_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local auth=$4
    
    local headers=(-H "Content-Type: application/json" -H "Accept: application/json")
    
    if [ "$auth" = "true" ] && [ -n "$ACCESS_TOKEN" ]; then
        headers+=(-H "Authorization: Bearer $ACCESS_TOKEN")
    fi
    
    if [ -n "$data" ]; then
        curl -s -X "$method" "${BASE_URL}${endpoint}" "${headers[@]}" -d "$data"
    else
        curl -s -X "$method" "${BASE_URL}${endpoint}" "${headers[@]}"
    fi
}

# Function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local expected_status=$4
    local data=$5
    local auth=$6
    
    TOTAL=$((TOTAL + 1))
    
    local response
    local status
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "${BASE_URL}${endpoint}" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json" \
            $([ "$auth" = "true" ] && [ -n "$ACCESS_TOKEN" ] && echo "-H \"Authorization: Bearer $ACCESS_TOKEN\"") \
            -d "$data")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "${BASE_URL}${endpoint}" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json" \
            $([ "$auth" = "true" ] && [ -n "$ACCESS_TOKEN" ] && echo "-H \"Authorization: Bearer $ACCESS_TOKEN\""))
    fi
    
    status=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✓${NC} $name"
        PASSED=$((PASSED + 1))
        echo "$body"
    else
        echo -e "${RED}✗${NC} $name (Expected: $expected_status, Got: $status)"
        FAILED=$((FAILED + 1))
        if [ "$HAS_JQ" = true ]; then
            echo "$body" | jq '.' 2>/dev/null || echo "$body"
        else
            echo "$body"
        fi
    fi
}

# Print section header
print_section() {
    echo ""
    echo -e "${CYAN}━━━ $1 ━━━${NC}"
    echo ""
}

# Print summary
print_summary() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Test Summary${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo "Total Tests: $TOTAL"
    echo -e "${GREEN}Passed: $PASSED${NC}"
    echo -e "${RED}Failed: $FAILED${NC}"
    
    if [ $TOTAL -gt 0 ]; then
        local success_rate=$(awk "BEGIN {printf \"%.2f\", ($PASSED/$TOTAL)*100}")
        echo "Success Rate: ${success_rate}%"
    fi
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Main test execution
echo -e "${BLUE}Fungura API Endpoint Test Suite${NC}"
echo "Testing API at: $BASE_URL"
echo ""

# Check if API is running
echo "Checking if API is running..."
if ! curl -s -f -o /dev/null "$API_URL"; then
    echo -e "${RED}Error: Cannot connect to API at $API_URL${NC}"
    echo "Please ensure the API server is running"
    exit 1
fi
echo -e "${GREEN}✓ API is reachable${NC}"

# ============================================
# Authentication Tests
# ============================================
print_section "Authentication Endpoints"

# Register
TIMESTAMP=$(date +%s)
REGISTER_DATA="{\"email\":\"test${TIMESTAMP}@example.com\",\"password\":\"Test123!@#\",\"name\":\"Test User\",\"role\":\"manager\"}"
REGISTER_RESPONSE=$(api_request "POST" "/auth/register" "$REGISTER_DATA" "false")
echo -e "${GREEN}✓${NC} POST /auth/register"
if [ "$HAS_JQ" = true ]; then
    ACCESS_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.accessToken // .access_token // empty')
    REFRESH_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.refreshToken // .refresh_token // empty')
    USER_ID=$(echo "$REGISTER_RESPONSE" | jq -r '.user.id // empty')
fi

# Login
LOGIN_DATA="{\"email\":\"test${TIMESTAMP}@example.com\",\"password\":\"Test123!@#\"}"
LOGIN_RESPONSE=$(api_request "POST" "/auth/login" "$LOGIN_DATA" "false")
echo -e "${GREEN}✓${NC} POST /auth/login"
if [ "$HAS_JQ" = true ] && [ -z "$ACCESS_TOKEN" ]; then
    ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken // .access_token // empty')
    REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.refreshToken // .refresh_token // empty')
    USER_ID=$(echo "$LOGIN_RESPONSE" | jq -r '.user.id // empty')
fi

echo "Access Token: ${ACCESS_TOKEN:0:20}..."

# ============================================
# Dashboard Tests
# ============================================
print_section "Dashboard Endpoints"

test_endpoint "GET /dashboard/stats" "GET" "/dashboard/stats" "200" "" "true"
test_endpoint "GET /dashboard/revenue" "GET" "/dashboard/revenue?period=month" "200" "" "true"
test_endpoint "GET /dashboard/order-types" "GET" "/dashboard/order-types" "200" "" "true"

# ============================================
# Orders Tests
# ============================================
print_section "Order Endpoints"

test_endpoint "GET /orders" "GET" "/orders" "200" "" "true"
test_endpoint "GET /orders/stats" "GET" "/orders/stats" "200" "" "true"

ORDER_DATA='{"customer":"John Doe","type":"dine-in","tableNumber":"12","items":[{"name":"Pasta","qty":2,"price":15.99}]}'
ORDER_RESPONSE=$(api_request "POST" "/orders" "$ORDER_DATA" "true")
echo -e "${GREEN}✓${NC} POST /orders"
if [ "$HAS_JQ" = true ]; then
    ORDER_ID=$(echo "$ORDER_RESPONSE" | jq -r '.id // empty')
fi

# ============================================
# Menu Tests
# ============================================
print_section "Menu Endpoints"

test_endpoint "GET /menu" "GET" "/menu" "200" "" "false"
test_endpoint "GET /menu/categories" "GET" "/menu/categories" "200" "" "false"
test_endpoint "GET /menu/trending" "GET" "/menu/trending?limit=5" "200" "" "false"

# ============================================
# Kitchen Tests
# ============================================
print_section "Kitchen Endpoints"

test_endpoint "GET /kitchen/orders" "GET" "/kitchen/orders" "200" "" "true"
test_endpoint "GET /kitchen/stats" "GET" "/kitchen/stats" "200" "" "true"
test_endpoint "GET /kitchen/drivers" "GET" "/kitchen/drivers" "200" "" "true"

# ============================================
# Inventory Tests
# ============================================
print_section "Inventory Endpoints"

test_endpoint "GET /inventory" "GET" "/inventory" "200" "" "true"
test_endpoint "GET /inventory/stats" "GET" "/inventory/stats" "200" "" "true"

# ============================================
# Reviews Tests
# ============================================
print_section "Review Endpoints"

test_endpoint "GET /reviews" "GET" "/reviews" "200" "" "false"
test_endpoint "GET /reviews/stats" "GET" "/reviews/stats" "200" "" "false"

# ============================================
# Notifications Tests
# ============================================
print_section "Notification Endpoints"

test_endpoint "GET /notifications" "GET" "/notifications" "200" "" "true"
test_endpoint "GET /notifications/unread-count" "GET" "/notifications/unread-count" "200" "" "true"

# ============================================
# Workers Tests
# ============================================
print_section "Worker Endpoints"

test_endpoint "GET /workers" "GET" "/workers" "200" "" "true"
test_endpoint "GET /workers/stats" "GET" "/workers/stats" "200" "" "true"
test_endpoint "GET /workers/drivers" "GET" "/workers/drivers" "200" "" "true"

# ============================================
# Summary
# ============================================
print_summary

# Exit with appropriate code
if [ $FAILED -gt 0 ]; then
    exit 1
else
    exit 0
fi
