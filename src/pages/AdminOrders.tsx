import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  Filter,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  shippingAddress: string;
  paymentMethod: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '#ORD-001',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 234 567 8900'
      },
      items: [
        { name: 'Nike Air Jordan 1', quantity: 1, price: 299.99 },
        { name: 'Supreme Box Logo Hoodie', quantity: 1, price: 399.99 }
      ],
      total: 699.98,
      status: 'delivered',
      date: '2024-01-15',
      shippingAddress: '123 Main St, New York, NY 10001',
      paymentMethod: 'Credit Card'
    },
    {
      id: '#ORD-002',
      customer: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1 234 567 8901'
      },
      items: [
        { name: 'Adidas Ultraboost 22', quantity: 1, price: 199.99 }
      ],
      total: 199.99,
      status: 'processing',
      date: '2024-01-14',
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90210',
      paymentMethod: 'PayPal'
    },
    {
      id: '#ORD-003',
      customer: {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+1 234 567 8902'
      },
      items: [
        { name: 'Stone Island Jacket', quantity: 1, price: 899.99 },
        { name: 'Off-White T-Shirt', quantity: 2, price: 199.99 }
      ],
      total: 1299.97,
      status: 'shipped',
      date: '2024-01-13',
      shippingAddress: '789 Pine Rd, Chicago, IL 60601',
      paymentMethod: 'Credit Card'
    },
    {
      id: '#ORD-004',
      customer: {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        phone: '+1 234 567 8903'
      },
      items: [
        { name: 'Carhartt Work Jacket', quantity: 1, price: 149.99 }
      ],
      total: 149.99,
      status: 'pending',
      date: '2024-01-12',
      shippingAddress: '321 Elm St, Miami, FL 33101',
      paymentMethod: 'Credit Card'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast({
      title: "Status updated",
      description: `Order ${orderId} status has been updated to ${newStatus}.`,
    });
  };

  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Orders data is being exported as CSV.",
    });
    setTimeout(() => {
      toast({
        title: "Export completed",
        description: "Orders data has been downloaded successfully.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600">Manage customer orders and track their status</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Orders
        </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          <CardDescription>Manage and track customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-sm text-gray-500">{order.customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${order.total}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      {getStatusBadge(order.status)}
                    </div>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Order Details - {order.id}</DialogTitle>
                            <DialogDescription>
                              Complete order information and customer details
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Customer Information */}
                            <div>
                              <h3 className="font-semibold mb-2">Customer Information</h3>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p><strong>Name:</strong> {order.customer.name}</p>
                                  <p><strong>Email:</strong> {order.customer.email}</p>
                                  <p><strong>Phone:</strong> {order.customer.phone}</p>
                                </div>
                                <div>
                                  <p><strong>Shipping Address:</strong></p>
                                  <p className="text-gray-600">{order.shippingAddress}</p>
                                </div>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div>
                              <h3 className="font-semibold mb-2">Order Items</h3>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Total</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {order.items.map((item, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{item.name}</TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell>${item.price}</TableCell>
                                      <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>

                            {/* Order Summary */}
                            <div className="flex justify-between items-center pt-4 border-t">
                              <div>
                                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                                <p><strong>Order Date:</strong> {order.date}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold">Total: ${order.total}</p>
                              </div>
                            </div>

                            {/* Status Update */}
                            <div>
                              <h3 className="font-semibold mb-2">Update Status</h3>
                              <Select 
                                value={order.status} 
                                onValueChange={(value) => handleStatusUpdate(order.id, value as Order['status'])}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
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

export default AdminOrders; 