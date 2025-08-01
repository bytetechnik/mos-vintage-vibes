import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Eye, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  status: 'active' | 'inactive';
  avatar: string;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      address: '123 Main St, New York, NY 10001',
      joinDate: '2023-01-15',
      totalOrders: 8,
      totalSpent: 2499.99,
      lastOrder: '2024-01-15',
      status: 'active',
      avatar: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 234 567 8901',
      address: '456 Oak Ave, Los Angeles, CA 90210',
      joinDate: '2023-03-20',
      totalOrders: 6,
      totalSpent: 1899.99,
      lastOrder: '2024-01-14',
      status: 'active',
      avatar: '/placeholder.svg'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1 234 567 8902',
      address: '789 Pine Rd, Chicago, IL 60601',
      joinDate: '2023-06-10',
      totalOrders: 5,
      totalSpent: 1599.99,
      lastOrder: '2024-01-13',
      status: 'active',
      avatar: '/placeholder.svg'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+1 234 567 8903',
      address: '321 Elm St, Miami, FL 33101',
      joinDate: '2023-08-05',
      totalOrders: 4,
      totalSpent: 1299.99,
      lastOrder: '2024-01-12',
      status: 'active',
      avatar: '/placeholder.svg'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david@example.com',
      phone: '+1 234 567 8904',
      address: '654 Maple Dr, Seattle, WA 98101',
      joinDate: '2023-11-12',
      totalOrders: 3,
      totalSpent: 999.99,
      lastOrder: '2024-01-11',
      status: 'inactive',
      avatar: '/placeholder.svg'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const stats = [
    {
      title: 'Total Customers',
      value: customers.length.toString(),
      icon: Mail,
    },
    {
      title: 'Active Customers',
      value: customers.filter(c => c.status === 'active').length.toString(),
      icon: ShoppingBag,
    },
    {
      title: 'Total Revenue',
      value: `$${customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}`,
      icon: DollarSign,
    },
    {
      title: 'Average Order Value',
      value: `$${(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.totalOrders, 0)).toFixed(2)}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage and analyze your customer base</p>
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
          <CardDescription>Manage and view customer information</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={customer.avatar}
                        alt={customer.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">Joined {customer.joinDate}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="flex items-center">
                        <Mail className="mr-1 h-3 w-3" />
                        {customer.email}
                      </p>
                      <p className="flex items-center">
                        <Phone className="mr-1 h-3 w-3" />
                        {customer.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <p className="font-medium">{customer.totalOrders}</p>
                      <p className="text-xs text-gray-500">orders</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${customer.totalSpent}</TableCell>
                  <TableCell>{customer.lastOrder}</TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Customer Details - {customer.name}</DialogTitle>
                          <DialogDescription>
                            Complete customer information and order history
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Customer Information */}
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <h3 className="font-semibold mb-3">Personal Information</h3>
                              <div className="space-y-2 text-sm">
                                <p><strong>Name:</strong> {customer.name}</p>
                                <p><strong>Email:</strong> {customer.email}</p>
                                <p><strong>Phone:</strong> {customer.phone}</p>
                                <p><strong>Join Date:</strong> {customer.joinDate}</p>
                                <p><strong>Status:</strong> {getStatusBadge(customer.status)}</p>
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-3">Address</h3>
                              <div className="flex items-start space-x-2 text-sm">
                                <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                                <p>{customer.address}</p>
                              </div>
                            </div>
                          </div>

                          {/* Order Statistics */}
                          <div>
                            <h3 className="font-semibold mb-3">Order Statistics</h3>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">{customer.totalOrders}</p>
                                <p className="text-sm text-gray-600">Total Orders</p>
                              </div>
                              <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">${customer.totalSpent}</p>
                                <p className="text-sm text-gray-600">Total Spent</p>
                              </div>
                              <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-2xl font-bold text-purple-600">
                                  ${(customer.totalSpent / customer.totalOrders).toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-600">Average Order</p>
                              </div>
                            </div>
                          </div>

                          {/* Recent Activity */}
                          <div>
                            <h3 className="font-semibold mb-3">Recent Activity</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span>Last Order</span>
                                <span className="font-medium">{customer.lastOrder}</span>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span>Member Since</span>
                                <span className="font-medium">{customer.joinDate}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCustomers; 