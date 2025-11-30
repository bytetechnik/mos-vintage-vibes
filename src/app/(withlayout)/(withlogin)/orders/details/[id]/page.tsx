'use client';

import { useOrderQuery } from '@/redux/api/orderApi';
import { Calendar, ChevronLeft, CreditCard, MapPin, Package, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// This should be imported from your API hooks file
// import { useOrderQuery } from '@/hooks/useOrderQuery';

const OrderDetailsPage = () => {
  const params = useParams();
  const id = params.id as string;

  // Replace this with your actual useOrderQuery hook
  const { data: ordersData, isLoading: isLoadingOrders } = useOrderQuery(id);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
      PROCESSING: "bg-blue-100 text-blue-800 border-blue-300",
      SHIPPED: "bg-purple-100 text-purple-800 border-purple-300",
      DELIVERED: "bg-green-100 text-green-800 border-green-300",
      CANCELLED: "bg-red-100 text-red-800 border-red-300"
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoadingOrders) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!ordersData?.success || !ordersData?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Failed to load order details</p>
          <p className="text-gray-600 mt-2">{ordersData?.message || 'Unknown error'}</p>
        </div>
      </div>
    );
  }
  const rawOrder = ordersData.data;

  const order = {
    ...rawOrder,
    shippingAddress: typeof rawOrder.shippingAddress === "string"
      ? JSON.parse(rawOrder.shippingAddress)
      : rawOrder.shippingAddress,

    billingAddress: typeof rawOrder.billingAddress === "string"
      ? JSON.parse(rawOrder.billingAddress)
      : rawOrder.billingAddress,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Orders
        </Link>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600 mt-1">Order #{order.orderNumber}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Items
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                  <Image
                    src={item.image || "/placeholder-product.png"}
                    alt={item.productName}
                    width={96}
                    height={96}
                    className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{item.productName}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.brandName}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.categoryName}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600 flex-wrap">
                      {item.size && <span>Size: {item.size}</span>}
                      <span>Qty: {item.quantity}</span>
                      {item.conditionRating && <span>Condition: {item.conditionRating}</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900">
                      {order.currency} {item.price.toFixed(2)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-sm text-gray-600 mt-1">
                        {(item.price * item.quantity).toFixed(2)} total
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          {(order.trackingNumber || order.shippingMethod) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Shipping Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {order.shippingMethod && (
                    <div>
                      <p className="text-sm text-gray-600">Shipping Method</p>
                      <p className="font-medium text-gray-900">{order.shippingMethod}</p>
                    </div>
                  )}
                  {order.trackingNumber && (
                    <div>
                      <p className="text-sm text-gray-600">Tracking Number</p>
                      <p className="font-medium text-gray-900 break-all">{order.trackingNumber}</p>
                    </div>
                  )}
                </div>
                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                  >
                    Track Package →
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Addresses */}
          {(order.shippingAddress || order.billingAddress) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Addresses
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {order.shippingAddress && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>

                    <div className="text-gray-600 text-sm space-y-1">
                      <p className="font-medium text-gray-900">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </p>
                      <p>{order.shippingAddress.address}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                      <div className="pt-2 mt-2 border-t border-gray-100">
                        <p>{order.shippingAddress.phone}</p>
                        <p>{order.shippingAddress.email}</p>
                      </div>
                    </div>

                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Billing Address</h3>

                  <div className="text-gray-600 text-sm space-y-1">
                    <p className="font-medium text-gray-900">
                      {order.billingAddress.firstName} {order.billingAddress.lastName}
                    </p>
                    <p>{order.billingAddress.address}</p>
                    <p>
                      {order.billingAddress.city}, {order.billingAddress.postalCode}
                    </p>
                    <p>{order.billingAddress.country}</p>
                    <div className="pt-2 mt-2 border-t border-gray-100">
                      <p>{order.billingAddress.phone}</p>
                      <p>{order.billingAddress.email}</p>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{order.subtotal.toFixed(2)}</span>
              </div>
              {order.shippingAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">{order.shippingAmount.toFixed(2)}</span>
                </div>
              )}
              {order.taxAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{order.taxAmount.toFixed(2)}</span>
                </div>
              )}
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">-{order.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900 text-lg">
                    {order.currency} ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          {(order.paymentMethod || order.paymentReference) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment
                </h2>
              </div>
              <div className="p-6 space-y-3">
                {order.paymentMethod && (
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium text-gray-900">{order.paymentMethod}</p>
                  </div>
                )}
                {order.paymentReference && (
                  <div>
                    <p className="text-sm text-gray-600">Reference</p>
                    <p className="font-medium text-gray-900 text-sm break-all">{order.paymentReference}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Date */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-3">
                <Calendar className="w-5 h-5 mr-2" />
                Order Date
              </h2>
              <p className="text-gray-600 text-sm">{formatDate(order.orderDate)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default OrderDetailsPage;