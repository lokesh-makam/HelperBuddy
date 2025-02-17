"use client"
import { useState } from 'react';
import { Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";

interface Review {
  id: string;
  orderId: string;
  userName: string;
  serviceName: string;
  serviceDate: string;
  rating: number;
  detailedReview: string;
}

// Mock data
const mockReviews: Review[] = [
  {
    id: '1',
    orderId: 'ORD001',
    userName: 'John Doe',
    serviceName: 'House Cleaning',
    serviceDate: '2024-02-15',
    rating: 4.5,
    detailedReview: 'Great service! Very thorough and professional. Would definitely recommend.'
  },
  {
    id: '2',
    orderId: 'ORD002',
    userName: 'Jane Smith',
    serviceName: 'Plumbing Repair',
    serviceDate: '2024-02-14',
    rating: 5,
    detailedReview: 'Fixed the issue quickly and efficiently. Very knowledgeable.'
  },
  // Add more mock reviews as needed
];

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // Filter and sort reviews
  const filteredReviews = mockReviews.filter(review => 
    review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime();
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Service Reviews</h1>
      
      {/* Search and Sort Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name, service, or order ID..."
            className="w-full p-2 pl-10 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <Select onValueChange={setSortBy} defaultValue="date">
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="rating">Sort by Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews Table */}
      <div className="border bg-white rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.orderId}</TableCell>
                <TableCell>{review.userName}</TableCell>
                <TableCell>{review.serviceName}</TableCell>
                <TableCell>{new Date(review.serviceDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="font-medium">{review.rating}</span>
                    <span className="text-yellow-400 ml-1">★</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="px-3 py-1 text-sm border border-black rounded-md hover:bg-black hover:text-white transition-colors"
                      >
                        View Details
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Review Details</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold">Order Information</h4>
                            <p>Order ID: {review.orderId}</p>
                            <p>Service Date: {new Date(review.serviceDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Customer</h4>
                            <p>{review.userName}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Service</h4>
                            <p>{review.serviceName}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Rating</h4>
                            <p>{review.rating} ★</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Detailed Review</h4>
                            <p className="text-gray-600">{review.detailedReview}</p>
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
      </div>
    </div>
  );
}