"use client"
import React, {useEffect, useState} from 'react';
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
import {getReviewsByServicePartner} from "@/src/actions/review";
import Loading from "@/src/app/loading";


interface Review {
  id: React.Key | null | undefined;
  review: any;
  rating: any;
  createdAt: string;
  serviceDate: string;
  serviceRequestId: React.ReactNode | undefined;
  serviceRequest: any;

}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
export default function ReviewsPage({partnerdetails}:any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [mockReviews, setMockReviews] = useState<Review[]>([]);
  useEffect(() => {
    if(partnerdetails){
      getReviewsByServicePartner(partnerdetails.id).then((res)=>{
        if(res.success){
          //@ts-ignore
          setMockReviews(res?.data);
          setLoading(false)
        }
      })
    }
  }, [partnerdetails]);
  if(loading) return <Loading/>
  console.log(mockReviews)
  // Filter and sort reviews
  const filteredReviews = mockReviews.filter(review => 
    review.serviceRequest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.serviceRequest.service.name.toLowerCase().includes(searchTerm.toLowerCase())||
      review.serviceRequest.id.toLowerCase().includes(searchTerm.toLowerCase())
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
                <TableCell>{review.serviceRequestId}</TableCell>
                <TableCell>{review.serviceRequest.firstName}</TableCell>
                <TableCell>{review.serviceRequest.service.name}</TableCell>
                <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
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
                        <div className="space-y-6">
                          <p><strong>Order ID:</strong> {review.serviceRequest.id}</p>
                          <p><strong>Customer:</strong> {review.serviceRequest.user.firstName} {review.serviceRequest.user.lastName}</p>
                          <p><strong>Email:</strong> {review.serviceRequest.user.email}</p>
                          <p><strong>Service:</strong> {review.serviceRequest.service.name}</p>
                          <p><strong>Date:</strong> {formatDate(review.createdAt)}</p>
                          <p><strong>Phone:</strong> {review.serviceRequest.phone}</p>
                          <p><strong>Rating:</strong> {review.rating}★</p>
                          <p><strong>Detailed Review:</strong> {review.review}</p>
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