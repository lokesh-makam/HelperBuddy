'use client'

import React, { useState, useEffect } from 'react';
import {
  Search,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
  Clock,
  CreditCard,
  Calendar,
  User,
  MapPin,
  Phone,
  ShoppingBag,
  AlertTriangle,
  Truck,
  Check,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from '@/src/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/src/components/ui/alert-dialog';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Separator } from '@/src/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';

// Sample orders data
const ORDERS_DATA = [
  {
    id: 'ORD-2023-0015',
    date: '2023-11-15T14:32:21',
    userName: 'John Doe',
    userId: 'USR001',
    serviceName: 'Premium Smartphone',
    serviceProvider: 'ElectroHub',
    price: 899.99,
    status: 'completed',
    paymentMethod: 'Credit Card',
    paymentStatus: 'paid',
    shippingAddress: '123 Broadway St, New York, NY 10001',
    billingAddress: '123 Broadway St, New York, NY 10001',
    email: 'john.doe@example.com',
    phone: '+1 (212) 555-1234',
    items: [
      { name: 'Premium Smartphone XL', quantity: 1, price: 899.99, total: 899.99 }
    ],
    subtotal: 899.99,
    shipping: 0,
    tax: 72.00,
    total: 971.99,
    notes: 'Customer requested gift wrapping',
    trackingNumber: 'TRK123456789',
    estimatedDelivery: '2023-11-18',
  },
  {
    id: 'ORD-2023-0014',
    date: '2023-11-14T09:45:17',
    userName: 'Jane Smith',
    userId: 'USR002',
    serviceName: 'Wireless Headphones',
    serviceProvider: 'AudioWorld',
    price: 249.95,
    status: 'shipped',
    paymentMethod: 'PayPal',
    paymentStatus: 'paid',
    shippingAddress: '456 Hollywood Blvd, Los Angeles, CA 90028',
    billingAddress: '456 Hollywood Blvd, Los Angeles, CA 90028',
    email: 'jane.smith@example.com',
    phone: '+1 (310) 555-5678',
    items: [
      { name: 'Wireless Headphones Pro', quantity: 1, price: 249.95, total: 249.95 }
    ],
    subtotal: 249.95,
    shipping: 5.99,
    tax: 20.00,
    total: 275.94,
    notes: '',
    trackingNumber: 'TRK987654321',
    estimatedDelivery: '2023-11-17',
  },
  {
    id: 'ORD-2023-0013',
    date: '2023-11-13T17:22:05',
    userName: 'Robert Johnson',
    userId: 'USR003',
    serviceName: 'Smart Home Security System',
    serviceProvider: 'HomeSecure',
    price: 549.99,
    status: 'processing',
    paymentMethod: 'Credit Card',
    paymentStatus: 'paid',
    shippingAddress: '789 Michigan Ave, Chicago, IL 60611',
    billingAddress: '789 Michigan Ave, Chicago, IL 60611',
    email: 'robert.j@example.com',
    phone: '+1 (312) 555-9012',
    items: [
      { name: 'Smart Home Security System Basic', quantity: 1, price: 549.99, total: 549.99 }
    ],
    subtotal: 549.99,
    shipping: 0,
    tax: 44.00,
    total: 593.99,
    notes: 'Rush shipping requested',
    trackingNumber: '',
    estimatedDelivery: '2023-11-19',
  },
  {
    id: 'ORD-2023-0012',
    date: '2023-11-12T11:05:30',
    userName: 'Emily Davis',
    userId: 'USR004',
    serviceName: 'Gaming Console',
    serviceProvider: 'GameZone',
    price: 499.99,
    status: 'awaiting payment',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'pending',
    shippingAddress: '321 Texas Ave, Houston, TX 77002',
    billingAddress: '321 Texas Ave, Houston, TX 77002',
    email: 'emily.davis@example.com',
    phone: '+1 (713) 555-3456',
    items: [
      { name: 'Gaming Console Pro', quantity: 1, price: 499.99, total: 499.99 },
      { name: 'Extra Controller', quantity: 1, price: 59.99, total: 59.99 }
    ],
    subtotal: 559.98,
    shipping: 9.99,
    tax: 45.00,
    total: 614.97,
    notes: '',
    trackingNumber: '',
    estimatedDelivery: '',
  },
  {
    id: 'ORD-2023-0011',
    date: '2023-11-11T15:48:22',
    userName: 'Michael Wilson',
    userId: 'USR005',
    serviceName: '4K Smart TV',
    serviceProvider: 'ScreenMasters',
    price: 1299.99,
    status: 'completed',
    paymentMethod: 'Credit Card',
    paymentStatus: 'paid',
    shippingAddress: '654 Market St, Philadelphia, PA 19107',
    billingAddress: '654 Market St, Philadelphia, PA 19107',
    email: 'michael.w@example.com',
    phone: '+1 (215) 555-7890',
    items: [
      { name: '4K Smart TV 55-inch', quantity: 1, price: 1299.99, total: 1299.99 },
      { name: 'Wall Mount Kit', quantity: 1, price: 49.99, total: 49.99 }
    ],
    subtotal: 1349.98,
    shipping: 0,
    tax: 108.00,
    total: 1457.98,
    notes: 'White glove delivery service added',
    trackingNumber: 'TRK456789123',
    estimatedDelivery: '2023-11-14',
  },
  {
    id: 'ORD-2023-0010',
    date: '2023-11-10T08:15:45',
    userName: 'Sophia Brown',
    userId: 'USR006',
    serviceName: 'Fitness Tracker',
    serviceProvider: 'FitTech',
    price: 129.99,
    status: 'shipped',
    paymentMethod: 'PayPal',
    paymentStatus: 'paid',
    shippingAddress: '987 Desert Rd, Phoenix, AZ 85001',
    billingAddress: '987 Desert Rd, Phoenix, AZ 85001',
    email: 'sophia.b@example.com',
    phone: '+1 (602) 555-2345',
    items: [
      { name: 'Fitness Tracker Pro', quantity: 1, price: 129.99, total: 129.99 },
      { name: 'Extra Bands (3-pack)', quantity: 1, price: 29.99, total: 29.99 }
    ],
    subtotal: 159.98,
    shipping: 4.99,
    tax: 13.00,
    total: 177.97,
    notes: '',
    trackingNumber: 'TRK321654987',
    estimatedDelivery: '2023-11-15',
  },
  {
    id: 'ORD-2023-0009',
    date: '2023-11-09T13:22:36',
    userName: 'William Jones',
    userId: 'USR007',
    serviceName: 'Laptop Computer',
    serviceProvider: 'TechWorld',
    price: 1499.99,
    status: 'cancelled',
    paymentMethod: 'Credit Card',
    paymentStatus: 'refunded',
    shippingAddress: '555 Alamo Plz, San Antonio, TX 78205',
    billingAddress: '555 Alamo Plz, San Antonio, TX 78205',
    email: 'william.j@example.com',
    phone: '+1 (210) 555-6789',
    items: [
      { name: 'Ultrabook Pro X', quantity: 1, price: 1499.99, total: 1499.99 },
      { name: 'Protection Plan (2-year)', quantity: 1, price: 199.99, total: 199.99 }
    ],
    subtotal: 1699.98,
    shipping: 0,
    tax: 136.00,
    total: 1835.98,
    notes: 'Cancelled by customer request',
    trackingNumber: '',
    estimatedDelivery: '',
  },
  {
    id: 'ORD-2023-0008',
    date: '2023-11-08T10:05:12',
    userName: 'Olivia Garcia',
    userId: 'USR008',
    serviceName: 'Wireless Speaker',
    serviceProvider: 'SoundSource',
    price: 89.99,
    status: 'delivered',
    paymentMethod: 'PayPal',
    paymentStatus: 'paid',
    shippingAddress: '222 Pacific Dr, San Diego, CA 92101',
    billingAddress: '222 Pacific Dr, San Diego, CA 92101',
    email: 'olivia.g@example.com',
    phone: '+1 (619) 555-0123',
    items: [
      { name: 'Wireless Speaker Mini', quantity: 2, price: 89.99, total: 179.98 }
    ],
    subtotal: 179.98,
    shipping: 5.99,
    tax: 14.40,
    total: 200.37,
    notes: '',
    trackingNumber: 'TRK654789321',
    estimatedDelivery: '2023-11-12',
  },
  {
    id: 'ORD-2023-0007',
    date: '2023-11-07T14:55:33',
    userName: 'James Miller',
    userId: 'USR009',
    serviceName: 'Robot Vacuum',
    serviceProvider: 'SmartHome',
    price: 349.99,
    status: 'delivered',
    paymentMethod: 'Credit Card',
    paymentStatus: 'paid',
    shippingAddress: '888 Cowboy Ln, Dallas, TX 75201',
    billingAddress: '888 Cowboy Ln, Dallas, TX 75201',
    email: 'james.m@example.com',
    phone: '+1 (214) 555-4567',
    items: [
      { name: 'Robot Vacuum Deluxe', quantity: 1, price: 349.99, total: 349.99 }
    ],
    subtotal: 349.99,
    shipping: 0,
    tax: 28.00,
    total: 377.99,
    notes: 'Left with doorman',
    trackingNumber: 'TRK987321654',
    estimatedDelivery: '2023-11-11',
  },
  {
    id: 'ORD-2023-0006',
    date: '2023-11-06T16:42:15',
    userName: 'Ava Martinez',
    userId: 'USR010',
    serviceName: 'Tablet Computer',
    serviceProvider: 'TechGadgets',
    price: 699.99,
    status: 'returned',
    paymentMethod: 'Credit Card',
    paymentStatus: 'refunded',
    shippingAddress: '777 Silicon Valley Blvd, San Jose, CA 95110',
    billingAddress: '777 Silicon Valley Blvd, San Jose, CA 95110',
    email: 'ava.m@example.com',
    phone: '+1 (408) 555-8901',
    items: [
      { name: 'Tablet Pro 12-inch', quantity: 1, price: 699.99, total: 699.99 },
      { name: 'Keyboard Case', quantity: 1, price: 129.99, total: 129.99 }
    ],
    subtotal: 829.98,
    shipping: 0,
    tax: 66.40,
    total: 896.38,
    notes: 'Returned due to defect',
    trackingNumber: 'RTN123789456',
    estimatedDelivery: '',
  },
  {
    id: 'ORD-2023-0005',
    date: '2023-11-05T09:15:28',
    userName: 'Benjamin Taylor',
    userId: 'USR011',
    serviceName: 'Coffee Maker',
    serviceProvider: 'KitchenPlus',
    price: 149.99,
    status: 'completed',
    paymentMethod: 'PayPal',
    paymentStatus: 'paid',
    shippingAddress: '444 Capitol St, Austin, TX 78701',
    billingAddress: '444 Capitol St, Austin, TX 78701',
    email: 'benjamin.t@example.com',
    phone: '+1 (512) 555-2345',
    items: [
      { name: 'Automatic Coffee Maker Pro', quantity: 1, price: 149.99, total: 149.99 }
    ],
    subtotal: 149.99,
    shipping: 8.99,
    tax: 12.00,
    total: 170.98,
    notes: '',
    trackingNumber: 'TRK456123789',
    estimatedDelivery: '2023-11-09',
  },
  {
    id: 'ORD-2023-0004',
    date: '2023-11-04T11:30:45',
    userName: 'Mia Anderson',
    userId: 'USR012',
    serviceName: 'Smart Watch',
    serviceProvider: 'WearTech',
    price: 299.99,
    status: 'processing',
    paymentMethod: 'Credit Card',
    paymentStatus: 'paid',
    shippingAddress: '333 Beach Blvd, Jacksonville, FL 32202',
    billingAddress: '333 Beach Blvd, Jacksonville, FL 32202',
    email: 'mia.a@example.com',
    phone: '+1 (904) 555-6789',
    items: [
      { name: 'Smart Watch Series 5', quantity: 1, price: 299.99, total: 299.99 },
      { name: 'Extra Watch Band', quantity: 1, price: 49.99, total: 49.99 }
    ],
    subtotal: 349.98,
    shipping: 0,
    tax: 28.00,
    total: 377.98,
    notes: '',
    trackingNumber: '',
    estimatedDelivery: '2023-11-12',
  },
  {
    id: 'ORD-2023-0003',
    date: '2023-11-03T14:20:10',
    userName: 'Alexander Thomas',
    userId: 'USR013',
    serviceName: 'Digital Camera',
    serviceProvider: 'PhotoPro',
    price: 799.99,
    status: 'shipped',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'paid',
    shippingAddress: '111 Western Way, Fort Worth, TX 76102',
    billingAddress: '111 Western Way, Fort Worth, TX 76102',
    email: 'alexander.t@example.com',
    phone: '+1 (817) 555-0123',
    items: [
      { name: 'Digital SLR Camera', quantity: 1, price: 799.99, total: 799.99 },
      { name: 'Camera Bag', quantity: 1, price: 59.99, total: 59.99 },
      { name: 'Memory Card 128GB', quantity: 1, price: 29.99, total: 29.99 }
    ],
    subtotal: 889.97,
    shipping: 0,
    tax: 71.20,
    total: 961.17,
    notes: '',
    trackingNumber: 'TRK789456123',
    estimatedDelivery: '2023-11-08',
  },
  {
    id: 'ORD-2023-0002',
    date: '2023-11-02T08:45:33',
    userName: 'Charlotte Hernandez',
    userId: 'USR014',
    serviceName: 'Electric Scooter',
    serviceProvider: 'MobilityTech',
    price: 599.99,
    status: 'awaiting payment',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'pending',
    shippingAddress: '999 Buckeye St, Columbus, OH 43215',
    billingAddress: '999 Buckeye St, Columbus, OH 43215',
    email: 'charlotte.h@example.com',
    phone: '+1 (614) 555-4567',
    items: [
      { name: 'Electric Scooter X1', quantity: 1, price: 599.99, total: 599.99 },
      { name: 'Helmet', quantity: 1, price: 49.99, total: 49.99 }
    ],
    subtotal: 649.98,
    shipping: 29.99,
    tax: 52.00,
    total: 731.97,
    notes: 'Heavy item shipping fee applied',
    trackingNumber: '',
    estimatedDelivery: '',
  },
  {
    id: 'ORD-2023-0001',
    date: '2023-11-01T13:15:22',
    userName: 'Daniel Walker',
    userId: 'USR015',
    serviceName: 'Gaming Laptop',
    serviceProvider: 'GameTech',
    price: 1799.99,
    status: 'completed',
    paymentMethod: 'Credit Card',
    paymentStatus: 'paid',
    shippingAddress: '555 Racing Ln, Indianapolis, IN 46204',
    billingAddress: '555 Racing Ln, Indianapolis, IN 46204',
    email: 'daniel.w@example.com',
    phone: '+1 (317) 555-8901',
    items: [
      { name: 'Gaming Laptop Elite', quantity: 1, price: 1799.99, total: 1799.99 },
      { name: 'Gaming Mouse', quantity: 1, price: 69.99, total: 69.99 },
      { name: 'Extended Warranty (3-year)', quantity: 1, price: 299.99, total: 299.99 }
    ],
    subtotal: 2169.97,
    shipping: 0,
    tax: 173.60,
    total: 2343.57,
    notes: 'Signature required upon delivery',
    trackingNumber: 'TRK123456788',
    estimatedDelivery: '2023-11-05',
  }
];

type Order = typeof ORDERS_DATA[0];
type OrderStatus = 'completed' | 'shipped' | 'processing' | 'awaiting payment' | 'cancelled' | 'delivered' | 'returned';

const RecentOrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Order>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(ORDERS_DATA);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  
  const ordersPerPage = 10;
  
  useEffect(() => {
    // Filter orders based on search term and status filter
    let filtered = ORDERS_DATA.filter(order => 
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.serviceName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'all' || order.status === statusFilter)
    );
    
    // Sort filtered orders
    const sorted = [...filtered].sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortField === 'price') {
        return sortDirection === 'asc'
          ? a.price - b.price
          : b.price - a.price;
      } else if (typeof a[sortField] === 'string' && typeof b[sortField] === 'string') {
        const aValue = (a[sortField] as string).toLowerCase();
        const bValue = (b[sortField] as string).toLowerCase();
        
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });
    
    setFilteredOrders(sorted);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchTerm, sortField, sortDirection, statusFilter]);
  
  // Calculate pagination
  const totalOrders = filteredOrders.length;
  const totalPages = Math.ceil(totalOrders / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);
  
  // Handle sorting
  const handleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Convert date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Status badge color mapping
  const getStatusBadge = (status: OrderStatus) => {
    switch(status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</Badge>;
      case 'delivered':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Delivered</Badge>;
      case 'shipped':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Shipped</Badge>;
      case 'processing':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Processing</Badge>;
      case 'awaiting payment':
        return <Badge variant="default" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">Awaiting Payment</Badge>;
      case 'cancelled':
        return <Badge variant="default" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Cancelled</Badge>;
      case 'returned':
        return <Badge variant="default" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">Returned</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };
  
  // Render pagination controls
  const renderPagination = () => {
    const pages = [];
    
    // Previous button
    pages.push(
      <Button 
        key="prev" 
        variant="outline" 
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    );
    
    // Page numbers
    const totalPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(totalPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + totalPagesToShow - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button 
          key={i} 
          variant={currentPage === i ? "default" : "outline"} 
          onClick={() => setCurrentPage(i)}
          className="h-8 w-8 p-0"
        >
          {i}
        </Button>
      );
    }
    
    // Next button
    pages.push(
      <Button 
        key="next" 
        variant="outline" 
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    );
    
    return pages;
  };

  // Cancel order function
  const handleCancelOrder = (orderId: string) => {
    const updatedOrders = ORDERS_DATA.map(order => 
      order.id === orderId 
        ? { ...order, status: 'cancelled' as OrderStatus, paymentStatus: 'refunded' } 
        : order
    );
    
    // In a real app, you would send this to your API
    console.log(`Order ${orderId} has been cancelled`);
    
    // Update filtered orders
    setFilteredOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled' as OrderStatus, paymentStatus: 'refunded' } 
          : order
      )
    );
    
    // Update selected order if it's open
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: 'cancelled', paymentStatus: 'refunded' });
    }
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Package className="mr-2 h-8 w-8 text-primary" />
          Recent Orders
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
          <ShoppingBag className="mr-1 h-4 w-4" />
          Total Orders: <span className="font-semibold ml-1">{totalOrders}</span>
        </p>
      </div>

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${ORDERS_DATA.reduce((sum, order) => sum + order.total, 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
            <p className="text-xs text-muted-foreground mt-1">+2.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ORDERS_DATA.filter(order => order.status === 'processing' || order.status === 'awaiting payment').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">-1.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ORDERS_DATA.filter(order => order.status === 'completed' || order.status === 'delivered').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cancelled Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ORDERS_DATA.filter(order => order.status === 'cancelled' || order.status === 'returned').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">+0.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search orders by ID, user, or service..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-auto flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Sort by:</span>
          <Select
            value={sortField}
            onValueChange={(value) => handleSort(value as keyof Order)}
          >
            <SelectTrigger className="w-[180px] rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="userName">User</SelectItem>
              <SelectItem value="serviceName">Service</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="h-10 w-10 rounded-lg border border-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all"
          >
            {sortDirection === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="w-full md:w-auto flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Filter by:</span>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}
          >
            <SelectTrigger className="w-[180px] rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="awaiting payment">Awaiting Payment</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="relative overflow-x-auto shadow-lg sm:rounded-lg mb-6">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gradient-to-r from-blue-50 to-purple-50 dark:bg-gradient-to-r dark:from-blue-900 dark:to-purple-900 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3">Order ID</th>
              <th scope="col" className="px-6 py-3">User</th>
              <th scope="col" className="px-6 py-3">Service</th>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr 
                key={order.id} 
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:bg-gradient-to-r dark:hover:from-blue-900 dark:hover:to-purple-900 transition-all"
              >
                <td className="px-6 py-4">{order.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{order.userName}</td>
                <td className="px-6 py-4">{order.serviceName}</td>
                <td className="px-6 py-4">{formatDate(order.date)}</td>
                <td className="px-6 py-4">${order.price.toFixed(2)}</td>
                <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                <td className="px-6 py-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all"
                      >
                        <Eye className="h-4 w-4 mr-2" /> View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                      {selectedOrder && (
                        <>
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              <Package className="w-6 h-6 text-purple-600" /> Order Details - {selectedOrder.id}
                              <span className="ml-2">
                                {getStatusBadge(selectedOrder.status)}
                              </span>
                            </DialogTitle>
                          </DialogHeader>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                            <div className="space-y-4">
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Information</h3>
                                <div className="mt-2 space-y-2">
                                  <p className="text-sm">
                                    <span className="font-medium">Order ID:</span> {selectedOrder.id}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Date:</span> {formatDate(selectedOrder.date)}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Service:</span> {selectedOrder.serviceName}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Service Provider:</span> {selectedOrder.serviceProvider}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Payment Status:</span> {selectedOrder.paymentStatus}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">User Information</h3>
                                <div className="mt-2 space-y-2">
                                  <p className="text-sm">
                                    <span className="font-medium">Name:</span> {selectedOrder.userName}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Email:</span> {selectedOrder.email}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Phone:</span> {selectedOrder.phone}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Shipping & Billing</h3>
                                <div className="mt-2 space-y-2">
                                  <p className="text-sm">
                                    <span className="font-medium">Shipping Address:</span> {selectedOrder.shippingAddress}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Billing Address:</span> {selectedOrder.billingAddress}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Items</h3>
                                <div className="mt-2 space-y-2">
                                  {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="text-sm">
                                      <span className="font-medium">{item.name}</span> - {item.quantity} x ${item.price.toFixed(2)} = ${item.total.toFixed(2)}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Summary</h3>
                                <div className="mt-2 space-y-2">
                                  <p className="text-sm">
                                    <span className="font-medium">Subtotal:</span> ${selectedOrder.subtotal.toFixed(2)}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Shipping:</span> ${selectedOrder.shipping.toFixed(2)}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Tax:</span> ${selectedOrder.tax.toFixed(2)}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Total:</span> ${selectedOrder.total.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="border-t pt-4 mt-2">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Notes</h3>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm">
                              <p className="text-gray-600 dark:text-gray-300">
                                {selectedOrder.notes || "No notes available."}
                              </p>
                            </div>
                          </div>

                          <DialogFooter className="mt-4">
                            <DialogClose asChild>
                              <Button variant="secondary">Close</Button>
                            </DialogClose>
                            {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'returned' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive">
                                    <X className="h-4 w-4 mr-2" /> Cancel Order
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to cancel this order?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will cancel the order and initiate a refund if applicable.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleCancelOrder(selectedOrder.id)}>
                                      Confirm
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </DialogFooter>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center space-x-2">
          {renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default RecentOrdersPage;
