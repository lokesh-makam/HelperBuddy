"use client"
import {useEffect, useState} from 'react';
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
  createdAt: any;
  id: string;
  serviceRequestId: string;
  rating: number;
  review: string;
  serviceDate: string;
  serviceRequest: {
    createdAt: any;
    id: string;
    firstName: string;
    service: {
      name: string;
    };
  };
}


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
    review.serviceRequest.service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.serviceRequestId.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold">Order Information</h4>
                            <p>Order ID: {review.id}</p>
                            <p>Service Date: {new Date(review.serviceRequest.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Customer</h4>
                            <p>{review.serviceRequest.firstName}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Service</h4>
                            <p>{review.serviceRequest.service.name}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Rating</h4>
                            <p>{review.rating} ★</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Detailed Review</h4>
                            <p className="text-gray-600">{review.review}</p>
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