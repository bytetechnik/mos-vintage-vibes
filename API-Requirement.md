# API Requirements for Mo's VintageWorld Ecommerce

This document outlines the RESTful API endpoints required to support all features of the ecommerce frontend. The API is intended to be implemented in Laravel.

---

## 1. Authentication & User Management

### 1.1. Registration
- **POST** `/api/register`
  - **Body:** `{ first_name, last_name, email, password, confirm_password }`
  - **Response:** User object, JWT token
  - **Notes:** Validate email uniqueness, password strength.

### 1.2. Login
- **POST** `/api/login`
  - **Body:** `{ email, password }`
  - **Response:** User object, JWT token

### 1.3. Logout
- **POST** `/api/logout`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Success message

### 1.4. Password Reset
- **POST** `/api/password/forgot`
  - **Body:** `{ email }`
  - **Response:** Success message (email sent)
- **POST** `/api/password/reset`
  - **Body:** `{ token, email, password, confirm_password }`
  - **Response:** Success message

### 1.5. Profile
- **GET** `/api/user`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** User object
- **PUT** `/api/user`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ first_name, last_name, email, phone, birth_date, avatar }`
  - **Response:** Updated user object

### 1.6. Change Password
- **POST** `/api/user/password`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ current_password, new_password, confirm_password }`
  - **Response:** Success message

### 1.7. Two-Factor Authentication (Optional)
- **POST** `/api/user/2fa/enable`
- **POST** `/api/user/2fa/disable`
- **POST** `/api/user/2fa/verify`

### 1.8. Download My Data (GDPR)
- **GET** `/api/user/data`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Downloadable user data (JSON/CSV)

---

## 2. Products & Catalog

### 2.1. List Products
- **GET** `/api/products`
  - **Query:** `search, category, brand, condition, price_min, price_max, featured, sort, page, per_page`
  - **Response:** Paginated list of products

### 2.2. Product Details
- **GET** `/api/products/{id}`
  - **Response:** Product object

### 2.3. Brands
- **GET** `/api/brands`
  - **Response:** List of brands

### 2.4. Categories
- **GET** `/api/categories`
  - **Response:** List of categories

---

## 3. Product Condition (Quality Numbering)

Products have a quality/condition rating (e.g., 1-10) and a description. This is used to indicate the state of each clothing item.

### 3.1. Condition Data Structure
- Each product includes:
  - `condition.rating` (integer, 1-10)
  - `condition.description` (string, e.g., 'Completely new with tags', 'Item is in perfect condition, no signs of wear, looks like new', etc.)

### 3.2. Condition Descriptions
- **GET** `/api/conditions`
  - **Response:** List of possible condition ratings and their descriptions
  - **Example:**
    ```json
    [
      { "rating": 10, "description": "Completely new with tags" },
      { "rating": 9, "description": "Item is in perfect condition, no signs of wear, looks like new" },
      ...
    ]
    ```

### 3.3. Filtering by Condition
- Product listing endpoint supports filtering by `condition` (rating or range).
- **GET** `/api/products?condition=8,9,10`

### 3.4. Admin/CRUD (if needed)
- **POST** `/api/conditions` (admin only)
- **PUT** `/api/conditions/{rating}` (admin only)
- **DELETE** `/api/conditions/{rating}` (admin only)

---

## 4. Cart

### 4.1. Get Cart
- **GET** `/api/cart`
  - **Header:** `Authorization: Bearer <token>` (or session for guests)
  - **Response:** Cart object

### 4.2. Add to Cart
- **POST** `/api/cart`
  - **Body:** `{ product_id, quantity, selected_size }`
  - **Response:** Updated cart

### 4.3. Update Cart Item
- **PUT** `/api/cart/{item_id}`
  - **Body:** `{ quantity, selected_size }`
  - **Response:** Updated cart

### 4.4. Remove Cart Item
- **DELETE** `/api/cart/{item_id}`
  - **Response:** Updated cart

### 4.5. Clear Cart
- **DELETE** `/api/cart`
  - **Response:** Empty cart

---

## 5. Wishlist

### 5.1. Get Wishlist
- **GET** `/api/wishlist`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** List of wishlist items

### 5.2. Add to Wishlist
- **POST** `/api/wishlist`
  - **Body:** `{ product_id }`
  - **Response:** Updated wishlist

### 5.3. Remove from Wishlist
- **DELETE** `/api/wishlist/{product_id}`
  - **Response:** Updated wishlist

---

## 6. Orders & Checkout

### 6.1. Place Order
- **POST** `/api/orders`
  - **Header:** `Authorization: Bearer <token>` (optional for guest)
  - **Body:** 
    - For registered: `{ shipping_address_id, payment_method }`
    - For guest: `{ shipping_info, payment_info, guest_email, create_account? }`
  - **Response:** Order confirmation, order object

### 6.2. List Orders
- **GET** `/api/orders`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** List of orders

### 6.3. Order Details
- **GET** `/api/orders/{id}`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Order object

### 6.4. Reorder
- **POST** `/api/orders/{id}/reorder`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** New order object

### 6.5. Track Order
- **GET** `/api/orders/{id}/track`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Tracking info

---

## 7. Address Management

### 7.1. List Addresses
- **GET** `/api/addresses`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** List of addresses

### 7.2. Add Address
- **POST** `/api/addresses`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ street, city, postal_code, country }`
  - **Response:** Address object

### 7.3. Update Address
- **PUT** `/api/addresses/{id}`
  - **Header:** `Authorization: Bearer <token>`
  - **Body:** `{ street, city, postal_code, country }`
  - **Response:** Updated address

### 7.4. Delete Address
- **DELETE** `/api/addresses/{id}`
  - **Header:** `Authorization: Bearer <token>`
  - **Response:** Success message

---

## 8. Miscellaneous

### 8.1. Notifications (Settings)
- **GET** `/api/user/notifications`
- **PUT** `/api/user/notifications`
  - **Body:** `{ order_updates, new_arrivals, sales_promotions }`

---

## 9. Guest Checkout

- Allow guest users to place orders with minimal info.
- Option to create account after checkout.

---

## 10. Security

- All sensitive endpoints require JWT authentication.
- Rate limiting for login, registration, password reset.
- 2FA endpoints (optional).
- GDPR-compliant data download.

---

## 11. Error Handling

- Consistent error response format: `{ message, errors, code }`
- Proper HTTP status codes.

---

## 12. API Response Example

```json
{
  "data": { ... },
  "message": "Success",
  "errors": null
}
```

---

**This API spec covers all user flows, including product browsing, cart, checkout, user account, wishlist, order management, authentication, security features, and product quality/condition numbering as observed in the frontend codebase.**

---

Would you like to add or clarify any business rules or custom features before implementation? 