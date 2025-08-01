# API Requirements for Mo's VintageWorld Ecommerce

This document outlines the comprehensive RESTful API endpoints required to support all features of the ecommerce frontend. The API is intended to be implemented in Laravel.

---

## 1. Authentication & User Management

### 1.1. Registration
- **POST** `/api/auth/register`
  - **Body:** `{ first_name, last_name, email, password, confirm_password }`
  - **Response:** 
    ```json
    {
      "data": {
        "user": { "id", "first_name", "last_name", "email", "created_at" },
        "token": "jwt_token_here"
      },
      "message": "User registered successfully"
    }
    ```
  - **Validation:** Email uniqueness, password strength (min 8 chars, mixed case, numbers)

### 1.2. Login
- **POST** `/api/auth/login`
  - **Body:** `{ email, password }`
  - **Response:** User object with JWT token
  - **Error:** 401 for invalid credentials

### 1.3. Logout
- **POST** `/api/auth/logout`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Success message

### 1.4. Refresh Token
- **POST** `/api/auth/refresh`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** New JWT token

### 1.5. Password Reset
- **POST** `/api/auth/password/forgot`
  - **Body:** `{ email }`
  - **Response:** Success message (email sent)
- **POST** `/api/auth/password/reset`
  - **Body:** `{ token, email, password, confirm_password }`
  - **Response:** Success message

### 1.6. Profile Management
- **GET** `/api/user/profile`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Complete user profile with addresses
- **PUT** `/api/user/profile`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ first_name, last_name, email, phone, birth_date, avatar }`
  - **Response:** Updated user object

### 1.7. Change Password
- **POST** `/api/user/password`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ current_password, new_password, confirm_password }`
  - **Response:** Success message

### 1.8. Account Deletion (GDPR)
- **DELETE** `/api/user/account`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ password }`
  - **Response:** Success message

### 1.9. Download My Data (GDPR)
- **GET** `/api/user/data`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Downloadable user data (JSON/CSV)

---

## 2. Products & Catalog

### 2.1. List Products
- **GET** `/api/products`
  - **Query Parameters:**
    - `search` (string): Search in name, brand, category, tags
    - `category` (string): Filter by category
    - `brand` (string): Filter by brand
    - `condition` (array): Filter by condition ratings (e.g., "8,9,10")
    - `price_min` (number): Minimum price
    - `price_max` (number): Maximum price
    - `featured` (boolean): Featured products only
    - `in_stock` (boolean): In stock only
    - `sort` (string): "newest", "price-low", "price-high", "name", "condition"
    - `page` (number): Page number
    - `per_page` (number): Items per page (default: 20)
  - **Response:**
    ```json
    {
      "data": [
        {
          "id": "string",
          "name": "string",
          "brand": "string",
          "price": "number",
          "original_price": "number|null",
          "description": "string",
          "category": "string",
          "condition": {
            "rating": "number",
            "description": "string"
          },
          "size": "string",
          "color": "string",
          "images": ["string"],
          "in_stock": "boolean",
          "featured": "boolean",
          "tags": ["string"],
          "created_at": "datetime"
        }
      ],
      "pagination": {
        "current_page": "number",
        "per_page": "number",
        "total": "number",
        "total_pages": "number",
        "has_next": "boolean",
        "has_prev": "boolean"
      }
    }
    ```

### 2.2. Product Details
- **GET** `/api/products/{id}`
  - **Response:** Single product object with full details
  - **Error:** 404 if product not found

### 2.3. Related Products
- **GET** `/api/products/{id}/related`
  - **Query:** `limit` (number, default: 4)
  - **Response:** Array of related products

### 2.4. Featured Products
- **GET** `/api/products/featured`
  - **Query:** `limit` (number, default: 8)
  - **Response:** Array of featured products

### 2.5. Latest Drops
- **GET** `/api/products/latest-drops`
  - **Query:** `limit` (number, default: 12)
  - **Response:** Array of newest products

### 2.6. Brands
- **GET** `/api/brands`
  - **Response:** List of all brands with logos
  - **Response Format:**
    ```json
    {
      "data": [
        {
          "id": "string",
          "name": "string",
          "logo": "string",
          "description": "string",
          "website": "string",
          "is_active": "boolean",
          "product_count": "number",
          "created_at": "datetime",
          "updated_at": "datetime"
        }
      ]
    }
    ```

### 2.7. Brand CRUD Operations (Admin)
- **POST** `/api/admin/brands`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ name, description, logo, website, is_active }`
  - **Response:** New brand object
- **GET** `/api/admin/brands/{id}`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Single brand object
- **PUT** `/api/admin/brands/{id}`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ name, description, logo, website, is_active }`
  - **Response:** Updated brand object
- **DELETE** `/api/admin/brands/{id}`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Success message

### 2.8. Categories
- **GET** `/api/categories`
  - **Response:** List of all categories
  - **Response Format:**
    ```json
    {
      "data": [
        {
          "id": "string",
          "name": "string",
          "slug": "string",
          "description": "string",
          "image": "string",
          "is_active": "boolean",
          "product_count": "number",
          "subcategories": [
            {
              "id": "string",
              "name": "string",
              "slug": "string",
              "product_count": "number"
            }
          ],
          "created_at": "datetime",
          "updated_at": "datetime"
        }
      ]
    }
    ```

### 2.9. Category CRUD Operations (Admin)
- **POST** `/api/admin/categories`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ name, description, image, is_active }`
  - **Response:** New category object
- **GET** `/api/admin/categories/{id}`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Single category object
- **PUT** `/api/admin/categories/{id}`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ name, description, image, is_active }`
  - **Response:** Updated category object
- **DELETE** `/api/admin/categories/{id}`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Success message

### 2.10. Subcategories
- **GET** `/api/subcategories`
  - **Query:** `category_id` (optional)
  - **Response:** List of subcategories
  - **Response Format:**
    ```json
    {
      "data": [
        {
          "id": "string",
          "name": "string",
          "slug": "string",
          "description": "string",
          "category_id": "string",
          "category_name": "string",
          "image": "string",
          "is_active": "boolean",
          "product_count": "number",
          "created_at": "datetime",
          "updated_at": "datetime"
        }
      ]
    }
    ```

### 2.11. Subcategory CRUD Operations (Admin)
- **POST** `/api/admin/subcategories`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ name, description, category_id, image, is_active }`
  - **Response:** New subcategory object
- **GET** `/api/admin/subcategories/{id}`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Single subcategory object
- **PUT** `/api/admin/subcategories/{id}`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ name, description, category_id, image, is_active }`
  - **Response:** Updated subcategory object
- **DELETE** `/api/admin/subcategories/{id}`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Success message

### 2.12. Product Search Autocomplete
- **GET** `/api/products/search/autocomplete`
  - **Query:** `q` (string): Search query
  - **Response:** Array of matching product names and brands

---

## 3. Product Condition System

### 3.1. Condition Ratings
- **GET** `/api/conditions`
  - **Response:** List of condition ratings and descriptions
  - **Response Format:**
    ```json
    {
      "data": [
        {
          "rating": 10,
          "description": "Completely new with tags",
          "color": "text-green-600"
        },
        {
          "rating": 9,
          "description": "Item is in perfect condition, no signs of wear, looks like new",
          "color": "text-green-500"
        },
        {
          "rating": 8,
          "description": "Item is used but in mint condition, has 2-3 small signs of wear",
          "color": "text-yellow-500"
        },
        {
          "rating": 7,
          "description": "Item is in okay condition, has several signs of wear",
          "color": "text-orange-500"
        }
      ]
    }
    ```

---

## 4. Cart Management

### 4.1. Get Cart
- **GET** `/api/cart`
  - **Header:** `Authorization: Bearer <token>` (optional for guest)
  - **Response:**
    ```json
    {
      "data": {
        "items": [
          {
            "id": "string",
            "product": "Product object",
            "quantity": "number",
            "selected_size": "string"
          }
        ],
        "total": "number",
        "item_count": "number"
      }
    }
    ```

### 4.2. Add to Cart
- **POST** `/api/cart`
  - **Header:** `Authorization: Bearer <token>` (optional for guest)
  - **Body:** `{ product_id, quantity, selected_size }`
  - **Response:** Updated cart object

### 4.3. Update Cart Item
- **PUT** `/api/cart/{item_id}`
  - **Header:** `Authorization: Bearer <token>` (optional for guest)
  - **Body:** `{ quantity, selected_size }`
  - **Response:** Updated cart object

### 4.4. Remove Cart Item
- **DELETE** `/api/cart/{item_id}`
  - **Header:** `Authorization: Bearer <token>` (optional for guest)
  - **Response:** Updated cart object

### 4.5. Clear Cart
- **DELETE** `/api/cart`
  - **Header:** `Authorization: Bearer <token>` (optional for guest)
  - **Response:** Empty cart object

### 4.6. Merge Guest Cart (after login)
- **POST** `/api/cart/merge`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ guest_cart_items }`
  - **Response:** Merged cart object

---

## 5. Wishlist Management

### 5.1. Get Wishlist
- **GET** `/api/wishlist`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Array of wishlist items

### 5.2. Add to Wishlist
- **POST** `/api/wishlist`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ product_id }`
  - **Response:** Updated wishlist

### 5.3. Remove from Wishlist
- **DELETE** `/api/wishlist/{product_id}`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Updated wishlist

### 5.4. Move Wishlist to Cart
- **POST** `/api/wishlist/move-to-cart`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ product_ids }`
  - **Response:** Updated cart and wishlist

---

## 6. Orders & Checkout

### 6.1. Place Order
- **POST** `/api/orders`
  - **Header:** `Authorization: Bearer <token>` (optional for guest)
  - **Body:** 
    ```json
    {
      "shipping_info": {
        "first_name": "string",
        "last_name": "string",
        "email": "string",
        "phone": "string",
        "address": "string",
        "city": "string",
        "postal_code": "string",
        "country": "string"
      },
      "payment_info": {
        "method": "string",
        "card_number": "string",
        "expiry_date": "string",
        "cvv": "string",
        "name_on_card": "string"
      },
      "guest_email": "string",
      "create_account": "boolean",
      "account_password": "string"
    }
    ```
  - **Response:** Order confirmation with order details

### 6.2. List Orders
- **GET** `/api/orders`
  - **Header:** `Authorization: Bearer <token>`
  - **Query:** `page`, `per_page`, `status`
  - **Response:** Paginated list of orders

### 6.3. Order Details
- **GET** `/api/orders/{id}`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Complete order object with items and tracking

### 6.4. Reorder
- **POST** `/api/orders/{id}/reorder`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** New order object

### 6.5. Track Order
- **GET** `/api/orders/{id}/track`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Tracking information

### 6.6. Cancel Order
- **POST** `/api/orders/{id}/cancel`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ reason }`
  - **Response:** Updated order status

---

## 7. Address Management

### 7.1. List Addresses
- **GET** `/api/addresses`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Array of user addresses

### 7.2. Add Address
- **POST** `/api/addresses`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ street, city, postal_code, country, is_default }`
  - **Response:** New address object

### 7.3. Update Address
- **PUT** `/api/addresses/{id}`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ street, city, postal_code, country, is_default }`
  - **Response:** Updated address object

### 7.4. Delete Address
- **DELETE** `/api/addresses/{id}`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Success message

### 7.5. Set Default Address
- **POST** `/api/addresses/{id}/default`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Updated address list

---

## 8. User Dashboard & Settings

### 8.1. Dashboard Overview
- **GET** `/api/dashboard`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Dashboard statistics and recent activity

### 8.2. Notification Settings
- **GET** `/api/user/notifications`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Current notification preferences
- **PUT** `/api/user/notifications`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ order_updates, new_arrivals, sales_promotions, newsletter }`
  - **Response:** Updated notification settings

### 8.3. Account Settings
- **GET** `/api/user/settings`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** User settings and preferences
- **PUT** `/api/user/settings`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ language, currency, timezone }`
  - **Response:** Updated settings

---

## 9. Special Features

### 9.1. Latest Drops Page
- **GET** `/api/products/latest-drops`
  - **Query:** All product filtering parameters
  - **Response:** Latest products with full filtering support

### 9.2. Archive Page
- **GET** `/api/products/archive`
  - **Query:** All product filtering parameters
  - **Response:** Older/vintage products

### 9.3. Gift Cards
- **GET** `/api/gift-cards`
  - **Response:** Available gift card options
- **POST** `/api/gift-cards/purchase`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ amount, recipient_email, message }`
  - **Response:** Gift card order

### 9.4. Product Reviews
- **GET** `/api/products/{id}/reviews`
  - **Response:** Product reviews and ratings
- **POST** `/api/products/{id}/reviews`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ rating, comment }`
  - **Response:** New review

---

## 10. Search & Filtering

### 10.1. Advanced Search
- **GET** `/api/search`
  - **Query:** All filtering parameters plus advanced options
  - **Response:** Search results with facets

### 10.2. Search Suggestions
- **GET** `/api/search/suggestions`
  - **Query:** `q` (search term)
  - **Response:** Search suggestions and autocomplete

---

## 11. Analytics & Tracking

### 11.1. Product Views
- **POST** `/api/analytics/product-view`
  - **Body:** `{ product_id, user_id? }`
  - **Response:** Success

### 11.2. Search Analytics
- **POST** `/api/analytics/search`
  - **Body:** `{ query, results_count, user_id? }`
  - **Response:** Success

---

## 12. Error Handling

### 12.1. Standard Error Response
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {},
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### 12.2. Validation Error Response
```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "field_name": ["Error message"]
    }
  }
}
```

---

## 13. Authentication & Security

### 13.1. JWT Token Structure
```json
{
  "token": "jwt_token_here",
  "expires_in": 3600,
  "refresh_token": "refresh_token_here"
}
```

### 13.2. Rate Limiting
- Login attempts: 5 per minute
- Registration: 3 per hour
- Password reset: 3 per hour
- API calls: 1000 per hour per user

### 13.3. CORS Configuration
- Allow frontend domain
- Allow credentials
- Allow necessary headers

---

## 14. File Upload

### 14.1. User Avatar Upload
- **POST** `/api/user/avatar`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** Form data with image file
  - **Response:** Avatar URL

### 14.2. Product Image Upload (Admin)
- **POST** `/api/admin/products/{id}/images`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** Form data with image files
  - **Response:** Image URLs

### 14.3. Category Image Upload (Admin)
- **POST** `/api/admin/categories/{id}/image`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** Form data with image file
  - **Response:** Image URL

### 14.4. Subcategory Image Upload (Admin)
- **POST** `/api/admin/subcategories/{id}/image`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** Form data with image file
  - **Response:** Image URL

### 14.5. Brand Logo Upload (Admin)
- **POST** `/api/admin/brands/{id}/logo`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** Form data with logo file
  - **Response:** Logo URL

---

## 15. Webhooks (Optional)

### 15.1. Order Status Updates
- **POST** `/api/webhooks/order-status`
  - **Body:** Order status change notification
  - **Response:** Success acknowledgment

### 15.2. Payment Confirmations
- **POST** `/api/webhooks/payment`
  - **Body:** Payment confirmation data
  - **Response:** Success acknowledgment

## 16. Admin Management

### 16.1. Category Management
- **List Categories (Admin)**
  - **GET** `/api/admin/categories`
  - **Header:** `Authorization: Bearer <token>`
  - **Query:** `page`, `per_page`, `search`, `is_active`
  - **Response:** Paginated list of categories with subcategory counts

- **Category Statistics**
  - **GET** `/api/admin/categories/stats`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Category statistics (total, active, inactive, products per category)

### 16.2. Subcategory Management
- **List Subcategories (Admin)**
  - **GET** `/api/admin/subcategories`
  - **Header:** `Authorization: Bearer <token>`
  - **Query:** `page`, `per_page`, `search`, `category_id`, `is_active`
  - **Response:** Paginated list of subcategories

- **Subcategory Statistics**
  - **GET** `/api/admin/subcategories/stats`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Subcategory statistics

### 16.3. Brand Management
- **List Brands (Admin)**
  - **GET** `/api/admin/brands`
  - **Header:** `Authorization: Bearer <token>`
  - **Query:** `page`, `per_page`, `search`, `is_active`
  - **Response:** Paginated list of brands with product counts

- **Brand Statistics**
  - **GET** `/api/admin/brands/stats`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Brand statistics (total, active, inactive, products per brand)

### 16.4. Bulk Operations
- **Bulk Category Operations**
  - **POST** `/api/admin/categories/bulk`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ action: "activate"|"deactivate"|"delete", ids: [string] }`
  - **Response:** Success message with affected count

- **Bulk Subcategory Operations**
  - **POST** `/api/admin/subcategories/bulk`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ action: "activate"|"deactivate"|"delete", ids: [string] }`
  - **Response:** Success message with affected count

- **Bulk Brand Operations**
  - **POST** `/api/admin/brands/bulk`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ action: "activate"|"deactivate"|"delete", ids: [string] }`
  - **Response:** Success message with affected count

---

This comprehensive API specification covers all features observed in the frontend, including:
- Complete user authentication and management
- Product catalog with advanced filtering and search
- Cart and wishlist functionality
- Order management and checkout
- User dashboard and settings
- Special features like latest drops, archive, and gift cards
- Analytics and tracking
- File upload capabilities
- Comprehensive admin management for categories, subcategories, and brands
- Proper error handling and security measures 