import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Download, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users,
  Calendar,
  Filter
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
  averageOrder: number;
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
  category: string;
}

interface TopCustomer {
  name: string;
  email: string;
  totalSpent: number;
  orders: number;
  lastOrder: string;
}

const AdminSales = () => {
  const [timeRange, setTimeRange] = useState('30');
  const { toast } = useToast();

  // Demo sales data
  const salesData: SalesData[] = [
    { date: '2024-01-01', revenue: 4500, orders: 25, customers: 20, averageOrder: 180 },
    { date: '2024-01-02', revenue: 5200, orders: 28, customers: 24, averageOrder: 185 },
    { date: '2024-01-03', revenue: 3800, orders: 22, customers: 18, averageOrder: 172 },
    { date: '2024-01-04', revenue: 6100, orders: 35, customers: 30, averageOrder: 174 },
    { date: '2024-01-05', revenue: 4800, orders: 26, customers: 22, averageOrder: 184 },
    { date: '2024-01-06', revenue: 5500, orders: 32, customers: 28, averageOrder: 171 },
    { date: '2024-01-07', revenue: 4200, orders: 24, customers: 20, averageOrder: 175 },
  ];

  const topProducts: TopProduct[] = [
    { name: 'Nike Air Jordan 1', sales: 45, revenue: 13499.55, category: 'Sneakers' },
    { name: 'Supreme Box Logo Hoodie', sales: 32, revenue: 12799.68, category: 'Streetwear' },
    { name: 'Adidas Ultraboost 22', sales: 28, revenue: 5599.72, category: 'Running' },
    { name: 'Stone Island Jacket', sales: 15, revenue: 13499.85, category: 'Outerwear' },
    { name: 'Off-White T-Shirt', sales: 38, revenue: 3799.62, category: 'Streetwear' },
  ];

  const topCustomers: TopCustomer[] = [
    { name: 'John Doe', email: 'john@example.com', totalSpent: 2499.99, orders: 8, lastOrder: '2024-01-15' },
    { name: 'Jane Smith', email: 'jane@example.com', totalSpent: 1899.99, orders: 6, lastOrder: '2024-01-14' },
    { name: 'Mike Johnson', email: 'mike@example.com', totalSpent: 1599.99, orders: 5, lastOrder: '2024-01-13' },
    { name: 'Sarah Wilson', email: 'sarah@example.com', totalSpent: 1299.99, orders: 4, lastOrder: '2024-01-12' },
    { name: 'David Brown', email: 'david@example.com', totalSpent: 999.99, orders: 3, lastOrder: '2024-01-11' },
  ];

  const categoryData = [
    { name: 'Sneakers', value: 35, color: '#8884d8' },
    { name: 'Streetwear', value: 30, color: '#82ca9d' },
    { name: 'Running', value: 20, color: '#ffc658' },
    { name: 'Outerwear', value: 15, color: '#ff7300' },
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
      title: 'Average Order Value',
      value: '$192.34',
      change: '+12.3%',
      changeType: 'positive',
      icon: TrendingUp,
    },
  ];

  const handleExport = (type: 'csv' | 'pdf') => {
    toast({
      title: "Export started",
      description: `Sales report is being exported as ${type.toUpperCase()}.`,
    });
    // Simulate export
    setTimeout(() => {
      toast({
        title: "Export completed",
        description: "Sales report has been downloaded successfully.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Report</h1>
          <p className="text-gray-600">Track your sales performance and analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center text-xs text-gray-600">
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                {stat.change} from last period
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue over the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Revenue distribution across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products and Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product) => (
                  <TableRow key={product.name}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell>{product.sales}</TableCell>
                    <TableCell>${product.revenue.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Highest spending customers</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Order</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCustomers.map((customer) => (
                  <TableRow key={customer.email}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell>${customer.totalSpent}</TableCell>
                    <TableCell>{customer.lastOrder}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Sales Data</CardTitle>
          <CardDescription>Daily breakdown of sales metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Customers</TableHead>
                <TableHead>Average Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.map((day) => (
                <TableRow key={day.date}>
                  <TableCell>{day.date}</TableCell>
                  <TableCell>${day.revenue.toLocaleString()}</TableCell>
                  <TableCell>{day.orders}</TableCell>
                  <TableCell>{day.customers}</TableCell>
                  <TableCell>${day.averageOrder}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSales; 