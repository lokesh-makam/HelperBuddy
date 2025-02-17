import { Clock, Calendar, CheckCircle, ClipboardList, User, Award } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  workingHours: {
    start: string;
    end: string;
  };
  totalServicesCompleted: number;
  pendingServices: number;
  rating: number;
}

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  isActive: boolean;
}

// Mock data
const mockProvider: ServiceProvider = {
  id: "SP001",
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "+1 (555) 123-4567",
  registrationDate: "2023-06-15",
  workingHours: {
    start: "09:00",
    end: "17:00"
  },
  totalServicesCompleted: 156,
  pendingServices: 3,
  rating: 4.8
};

export default function DashboardPage({partnerdetails}:any) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {partnerdetails.name}</h1>
        <p className="text-gray-600">Here's an overview of your service profile and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partnerdetails.totalServicesCompleted}</div>
            <p className="text-xs text-gray-600">Completed services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Services</CardTitle>
            <ClipboardList className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partnerdetails.pendingServices}</div>
            <p className="text-xs text-gray-600">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Award className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partnerdetails.rating} ★</div>
            <p className="text-xs text-gray-600">Average customer rating</p>
          </CardContent>
        </Card>

        {/*<Card>*/}
        {/*  <CardHeader className="flex flex-row items-center justify-between pb-2">*/}
        {/*    <CardTitle className="text-sm font-medium">Active Services</CardTitle>*/}
        {/*    <User className="h-4 w-4 text-gray-500" />*/}
        {/*  </CardHeader>*/}
        {/*  <CardContent>*/}
        {/*    <div className="text-2xl font-bold">*/}
        {/*      {mockProvider.services.filter(s => s.isActive).length}*/}
        {/*    </div>*/}
        {/*    <p className="text-xs text-gray-600">Currently offered</p>*/}
        {/*  </CardContent>*/}
        {/*</Card>*/}
      </div>

      {/* Provider Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Name:</span>
                <span>{partnerdetails.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Registered:</span>
                <span>{new Date(partnerdetails.createdAt).toLocaleDateString()}</span>
              </div>
            {/*  <div className="flex items-center space-x-2">*/}
            {/*    <Clock className="h-4 w-4 text-gray-500" />*/}
            {/*    <span className="font-medium">Working Hours:</span>*/}
            {/*    <span>{mockProvider.workingHours.start} - {mockProvider.workingHours.end}</span>*/}
            {/*  </div>*/}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="font-medium">Email:</span>
                <p>{partnerdetails.email}</p>
              </div>
              <div>
                <span className="font-medium">Phone:</span>
                <p>{partnerdetails.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Table */}
      {/*<Card>*/}
      {/*  <CardHeader>*/}
      {/*    <CardTitle>Your Services</CardTitle>*/}
      {/*  </CardHeader>*/}
      {/*  <CardContent>*/}
      {/*    <Table>*/}
      {/*      <TableHeader>*/}
      {/*        <TableRow>*/}
      {/*          <TableHead>Service Name</TableHead>*/}
      {/*          <TableHead>Price</TableHead>*/}
      {/*          <TableHead>Description</TableHead>*/}
      {/*          <TableHead>Status</TableHead>*/}
      {/*        </TableRow>*/}
      {/*      </TableHeader>*/}
      {/*      <TableBody>*/}
      {/*        {mockProvider.services.map((service) => (*/}
      {/*          <TableRow key={service.id}>*/}
      {/*            <TableCell className="font-medium">{service.name}</TableCell>*/}
      {/*            <TableCell>${service.price}</TableCell>*/}
      {/*            <TableCell>{service.description}</TableCell>*/}
      {/*            <TableCell>*/}
      {/*              <span className={`px-2 py-1 rounded-full text-xs ${*/}
      {/*                service.isActive */}
      {/*                  ? 'bg-green-100 text-green-800' */}
      {/*                  : 'bg-gray-100 text-gray-800'*/}
      {/*              }`}>*/}
      {/*                {service.isActive ? 'Active' : 'Inactive'}*/}
      {/*              </span>*/}
      {/*            </TableCell>*/}
      {/*          </TableRow>*/}
      {/*        ))}*/}
      {/*      </TableBody>*/}
      {/*    </Table>*/}
      {/*  </CardContent>*/}
      {/*</Card>*/}
    </div>
  );
}