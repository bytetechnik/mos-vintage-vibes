# Admin Panel Documentation

## Overview
The admin panel for Mo's VintageWorld provides comprehensive management tools for inventory, sales, orders, customers, and system settings.

## Access
- **URL**: `/admin/login`
- **Demo Credentials**:
  - Email: `admin@mo-vintage.com`
  - Password: `admin123`

## Features

### 🔐 Authentication
- Secure login system with demo credentials
- Session management with localStorage
- Automatic redirect to login for unauthenticated users

### 📊 Dashboard
- **Overview Statistics**: Revenue, orders, customers, and product counts
- **Sales Charts**: Line charts showing revenue trends and order volume
- **Recent Orders**: Latest customer orders with status indicators
- **Low Stock Alerts**: Products running low on inventory

### 📦 Inventory Management
- **Product Listing**: Complete product catalog with search and filters
- **CRUD Operations**: Add, edit, and delete products
- **Stock Management**: Track inventory levels and set thresholds
- **Category & Brand Management**: Organize products by categories and brands
- **Status Tracking**: Active, inactive, and out-of-stock status

### 📈 Sales Reports
- **Revenue Analytics**: Detailed sales performance metrics
- **Chart Visualizations**: Line charts, bar charts, and pie charts
- **Top Products**: Best-selling items by revenue
- **Top Customers**: Highest spending customers
- **Export Functionality**: CSV and PDF export options
- **Time Range Filtering**: 7 days, 30 days, 90 days, or 1 year

### 🛒 Orders Management
- **Order Tracking**: Complete order lifecycle management
- **Status Updates**: Pending, processing, shipped, delivered, cancelled
- **Customer Details**: Full customer information for each order
- **Order Details**: Item breakdown, pricing, and shipping information
- **Search & Filtering**: Find orders by ID, customer, or status

### 👥 Customer Management
- **Customer Database**: Complete customer profiles
- **Order History**: Track customer purchase patterns
- **Contact Information**: Email, phone, and address management
- **Analytics**: Total spent, order count, and average order value
- **Status Management**: Active and inactive customer status

### ⚙️ Settings
- **General Settings**: Store information, currency, timezone
- **Notification Preferences**: Email and system notification settings
- **Security Settings**: Two-factor authentication, session timeout
- **Display Settings**: Theme, language, date/time formats
- **Password Management**: Change admin account password

## Technical Implementation

### Components Structure
```
src/
├── components/
│   └── AdminLayout.tsx          # Main admin layout with sidebar
├── pages/
│   ├── AdminLogin.tsx           # Login page
│   ├── AdminDashboard.tsx       # Dashboard overview
│   ├── AdminInventory.tsx       # Inventory management
│   ├── AdminSales.tsx           # Sales reports
│   ├── AdminOrders.tsx          # Orders management
│   ├── AdminCustomers.tsx       # Customer management
│   └── AdminSettings.tsx        # Settings page
```

### Key Technologies
- **React 18** with TypeScript
- **React Router** for navigation
- **Shadcn/ui** components
- **Recharts** for data visualization
- **Lucide React** for icons
- **Tailwind CSS** for styling

### State Management
- **Local State**: React useState for component-level state
- **Local Storage**: For authentication tokens and user sessions
- **Demo Data**: Static data arrays for demonstration purposes

### Routing
```typescript
// Admin Routes
/admin/login          # Login page
/admin/dashboard      # Main dashboard
/admin/inventory      # Inventory management
/admin/sales          # Sales reports
/admin/orders         # Orders management
/admin/customers      # Customer management
/admin/settings       # Settings page
```

## Demo Data

### Products
- Nike Air Jordan 1 Retro High OG
- Adidas Ultraboost 22
- Supreme Box Logo Hoodie
- Stone Island Shadow Project Jacket

### Customers
- John Doe (8 orders, $2,499.99)
- Jane Smith (6 orders, $1,899.99)
- Mike Johnson (5 orders, $1,599.99)
- Sarah Wilson (4 orders, $1,299.99)
- David Brown (3 orders, $999.99)

### Orders
- Sample orders with various statuses
- Realistic pricing and item quantities
- Different payment methods and shipping addresses

## Future Enhancements

### API Integration
- Replace demo data with real API calls
- Implement proper authentication with JWT tokens
- Add real-time updates for orders and inventory

### Additional Features
- **User Management**: Multiple admin users with roles
- **Advanced Analytics**: More detailed reporting and insights
- **Bulk Operations**: Mass import/export of products
- **Email Notifications**: Automated email alerts
- **Mobile App**: React Native admin app

### Security Improvements
- **Two-Factor Authentication**: SMS or authenticator app
- **Role-Based Access**: Different permissions for different users
- **Audit Logs**: Track all admin actions
- **Data Encryption**: Secure sensitive customer data

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access Admin Panel**
   - Navigate to `http://localhost:5173/admin/login`
   - Use demo credentials: `admin@mo-vintage.com` / `admin123`

4. **Explore Features**
   - Start with the Dashboard for an overview
   - Manage inventory in the Inventory section
   - View sales reports and analytics
   - Process orders and manage customers
   - Configure settings as needed

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository. 