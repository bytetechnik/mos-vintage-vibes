import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Eye,
  Plus,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Demo data for charts
  const salesData = [
    { name: 'Jan', sales: 4000, orders: 24 },
    { name: 'Feb', sales: 3000, orders: 13 },
    { name: 'Mar', sales: 2000, orders: 18 },
    { name: 'Apr', sales: 2780, orders: 39 },
    { name: 'May', sales: 1890, orders: 48 },
    { name: 'Jun', sales: 2390, orders: 38 },
    { name: 'Jul', sales: 3490, orders: 43 },
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', amount: 299.99, status: 'completed', date: '2024-01-15' },
    { id: '#ORD-002', customer: 'Jane Smith', amount: 199.99, status: 'pending', date: '2024-01-14' },
    { id: '#ORD-003', customer: 'Mike Johnson', amount: 399.99, status: 'processing', date: '2024-01-13' },
    { id: '#ORD-004', customer: 'Sarah Wilson', amount: 149.99, status: 'completed', date: '2024-01-12' },
  ];

  const lowStockItems = [
    { name: 'Nike Air Jordan 1', stock: 3, threshold: 10 },
    { name: 'Adidas Ultraboost', stock: 5, threshold: 15 },
    { name: 'Supreme Box Logo Hoodie', stock: 2, threshold: 8 },
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      title: 'Total Orders',
      value: '2,350',
      change: '+180.1%',
      changeType: 'positive',
      icon: ShoppingCart,
    },
    {
      title: 'Active Customers',
      value: '1,234',
      change: '+19%',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Products in Stock',
      value: '573',
      change: '-2.3%',
      changeType: 'negative',
      icon: Package,
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome to your admin dashboard</p>
        </div>
        <Button onClick={() => navigate('/admin/inventory')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center text-xs text-gray-600 mt-1">
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle>Orders Overview</CardTitle>
            <CardDescription>Monthly order volume</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-1 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{order.id}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${order.amount}</p>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>Products running low on inventory</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {lowStockItems.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-1 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Stock: {item.stock} / {item.threshold}
                    </p>
                  </div>
                  <Badge variant="destructive">
                    Low Stock
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard; 