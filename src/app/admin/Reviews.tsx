"use client"
import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import {getReviews, toggleHomepageStatus, updateReviewStatus} from '@/src/actions/review';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/src/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
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
} from '@/src/components/ui/alert-dialog';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Search } from 'lucide-react';
import { toast } from 'react-toastify';
import Loading from "@/src/app/loading";

// Define the Review type
interface Review {
  id: string;                        // Unique review identifier
  serviceRequestId: string;          // ID of the related service request
  serviceRequest: {
    id: string;
    userId: string;                  // User who made the request
    serviceId: string;               // Service ID
    servicePartnerId?: string;       // Optional: Service partner assigned
    status: string;                  // Status of the service request
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    amount: number;
    walletused: number;
    finalamount: number;
    preferredDate?: Date;
    preferredTime?: string;
    acceptedByProvider: boolean;
    acceptedAt?: Date;
    completedAt?: Date;
    completionstatus: string;
    rating?: number;                 // Optional rating
    review?: string;                 // Optional review text
    reviewedAt?: Date;
    paymentStatus: string;
    paymentMethod?: string;
    paymentAt?: Date;
    cancellationReason?: string;
    cancelledAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    service: {
      id: string;
      name: string;
      description?: string;
      category: string;
      basePrice: number;
      estimatedTime?: string;
      rating?: number;
      imageUrl?: string;
      createdAt: Date;
      updatedAt: Date;
    };
    servicePartner?: {
      id: string;
      fullName: string;
      email: string;
      phone: string;
      address: string;
      rating: number;
      totalServicesCompleted: number;
    };
  };
  homepageReview?: {
    status: boolean;
  };
  rating: number;                    // Review rating (e.g., 1 to 5)
  review: string;                    // Review text content
  status: string;                   // Review status ("pending", "approved", etc.)
  createdAt: Date;                   // Timestamp when the review was created
}


const AdminReviewsPage = () => {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading,setloading]=useState(true);
  useEffect(() => {
    async function fetchReviews() {
      const reviews = await getReviews();
      if(reviews?.success){
        // @ts-ignore
        setReviews(reviews?.data||[]);
        setloading(false)
      }
    }
    fetchReviews();
  }, []);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  // State for the review detail dialog
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [confirmDialogAction, setConfirmDialogAction] = useState<'display' | 'hide' | null>(null);
  const [confirmDialogAction1, setConfirmDialogAction1] = useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isConfirmDialogOpen1, setIsConfirmDialogOpen1] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setIsViewDialogOpen(true);
  };

  const handleDisplayToggleConfirm = (review: Review, action: 'display' | 'hide') => {
    setSelectedReview(review);
    setConfirmDialogAction(action);
    setIsConfirmDialogOpen(true);
  };
  const handleDisplayToggleConfirm1 = (review: Review, action: boolean | undefined) => {
    setSelectedReview(review);
    // @ts-ignore
    setConfirmDialogAction1(!action);
    setIsConfirmDialogOpen1(true);
  };


  // Improved toggle function with API call and error handling
  const toggleReviewDisplay = async () => {
    if (!selectedReview || !confirmDialogAction) return;

    const newStatus = confirmDialogAction === 'display';

    try {

      const response = await updateReviewStatus(selectedReview.id, newStatus?'true':'false');

      if (response.success) {
        setReviews(prev => prev.map(r =>
            r.id === selectedReview.id ? {...r, status: newStatus?'true':'false'} : r
        ));
      }else{
        toast.error(response.message);
      }

    } catch (error) {
      console.error("Failed to update review status:", error);
      toast.error("Failed to update review status.");
    } finally {
      setIsConfirmDialogOpen(false);
      setConfirmDialogAction(null);
    }
  };
  const toggleHomepageDisplay = async () => {
    if (!selectedReview) return;

    const newStatus:boolean = confirmDialogAction1;

    try {
      const response = await toggleHomepageStatus(selectedReview.id, newStatus);
      if (response.success) {
        setReviews(prev => prev.map(r =>
            r.id === selectedReview.id ? {...r, homepageReview:{
                ...selectedReview.homepageReview,
                status: newStatus
              }} : r
        ));
      }else{
        toast.error("something went wrong");
      }
    } catch (error) {
      console.error("Failed to update review status:", error);
      toast.error("Failed to update review status.");
    } finally {
      setIsConfirmDialogOpen1(false);
      setConfirmDialogAction1(false);
    }
  };

  // Function to render stars based on rating
  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
        <div className="flex">
          {[...Array(fullStars)].map((_, i) => (
              <span key={`full-${i}`} className="text-yellow-400">★</span>
          ))}
          {hasHalfStar && <span className="text-yellow-400">½</span>}
          {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
              <span key={`empty-${i}`} className="text-gray-300">★</span>
          ))}
        </div>
    );
  };

  if(loading){
    return <Loading/>
  }

  return (
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <h1 className="text-2xl font-bold">Manage Reviews</h1>
          <div className="relative">
            <input
                type="text"
                placeholder="Search by user, service or review.."
                className="pl-10 pr-4 py-2 border rounded-md w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg bg-white border shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Review ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Service Name</TableHead>
                <TableHead className="hidden md:table-cell">Provider</TableHead>
                {/*<TableHead className="hidden sm:table-cell">Date</TableHead>*/}
                <TableHead className="hidden lg:table-cell">Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Homepage visibility</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews
                  .filter((review) => {
                    const fullName = `${review.serviceRequest.firstName} ${review.serviceRequest.lastName}`.toLowerCase();
                    const serviceName = review.serviceRequest.service.name.toLowerCase();
                    const providerName = review.serviceRequest?.servicePartner?.fullName?.toLowerCase() || '';
                    const reviewText = review.review?.toLowerCase() || '';
                    return (
                        fullName.includes(searchTerm.toLowerCase()) ||
                        serviceName.includes(searchTerm.toLowerCase()) ||
                        providerName.includes(searchTerm.toLowerCase()) ||
                        reviewText.includes(searchTerm.toLowerCase())
                    );
                  }).map((review) => (
                      <TableRow key={review.id}>
                        <TableCell className="font-mono text-xs">{review.id}</TableCell>
                        <TableCell>{review.serviceRequest.firstName} {review.serviceRequest.lastName}</TableCell>
                        <TableCell>{review.serviceRequest.service.name}</TableCell>
                        <TableCell
                            className="hidden md:table-cell">{review.serviceRequest?.servicePartner?.fullName}</TableCell>
                        {/*<TableCell*/}
                        {/*    className="hidden sm:table-cell">{formatDate(review.createdAt.toLocaleDateString())}</TableCell>*/}
                        <TableCell className="hidden lg:table-cell">{renderRatingStars(review.rating)}</TableCell>
                        <TableCell>
                          <Badge
                              variant={review.status == "true" ? "destructive" : "secondary"}
                              className={`${review.status == "true" ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          >
                            {review.status == "true" ? 'Displayed' : 'Hidden'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                              variant={review.homepageReview?.status ? "destructive" : "secondary"}
                              className={`${review.homepageReview?.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          >
                            {review.homepageReview?.status? 'Displayed' : 'Hidden'}
                          </Badge>
                        </TableCell>
                        <TableCell >
                          <div className="flex  gap-2">
                            <Button
                                onClick={() => handleViewReview(review)}
                                variant="outline"
                                size="sm"
                                className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 shadow-sm rounded-md flex items-center"
                            >
                              <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                              </svg>
                              View
                            </Button>

                            <Button
                                onClick={() => handleDisplayToggleConfirm(review, review.status == "true" ? 'hide' : 'display')}
                                variant={review.status == "true" ? "outline" : "default"}
                                size="sm"
                                className={`px-3 py-2 font-medium w-24 transition-all rounded-md flex items-center justify-center shadow-sm ${
                                    review.status == "true"
                                        ? 'text-red-700 border border-red-300 bg-white hover:bg-red-50'
                                        : 'text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100'
                                }`}
                            >
                              {review.status == "true" ? (
                                  <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                                    </svg>
                                    Hide
                                  </>
                              ) : (
                                  <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                    </svg>
                                    Display
                                  </>
                              )}
                            </Button>

                            <Button
                                onClick={() => handleDisplayToggleConfirm1(review, review.homepageReview?.status)}
                                variant="outline"
                                size="sm"
                                className={`px-3 py-2 font-medium transition-all rounded-md flex items-center justify-center shadow-sm ${
                                    review.homepageReview?.status
                                        ? 'text-red-700 border border-red-300 bg-white hover:bg-red-50 w-40'
                                        : 'text-green-700 border border-green-300 bg-white hover:bg-green-50 w-36'
                                }`}
                            >
                              {review.homepageReview?.status ? (
                                  <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                                    </svg>
                                    <span className="text-xs font-semibold">Remove from Homepage</span>
                                  </>
                              ) : (
                                  <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                    </svg>
                                    Add to Homepage
                                  </>
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>

        {/* Review Detail Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Review Details</DialogTitle>
            </DialogHeader>
            <div>
              {selectedReview && (
                  <div className="space-y-4">
                    <p><strong>Order ID:</strong> {selectedReview.serviceRequest.id}</p>
                    <p>
                      <strong>Customer:</strong> {selectedReview.serviceRequest.user.firstName} {selectedReview.serviceRequest.user.lastName}
                    </p>
                    <p><strong>Email:</strong> {selectedReview.serviceRequest.user.email}</p>
                    <p><strong>Service:</strong> {selectedReview.serviceRequest.service.name}</p>
                    <p><strong>Date:</strong> {formatDate(selectedReview.createdAt.toLocaleDateString())}</p>
                    <p><strong>Phone:</strong> {selectedReview.serviceRequest.phone}</p>
                    <p><strong>Rating:</strong> {selectedReview.rating}★</p>
                    <p><strong>Detailed Review:</strong> {selectedReview.review}</p>
                    <div className="flex">
                      <p><strong>Status:</strong></p>
                      <Badge
                          variant={selectedReview.status == "true" ? "destructive" : "secondary"}
                          className={`${selectedReview.status == "true" ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {selectedReview.status == "true" ? 'Displayed to Users' : 'Hidden from Users'}
                      </Badge>
                    </div>
                  </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        {/* Confirmation Dialog */}
        <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmDialogAction === 'display'
                    ? 'Display this review?'
                    : 'Hide this review?'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {confirmDialogAction === 'display'
                    ? 'This review will be visible to all users.'
                    : 'This review will be hidden from all users.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={
                () => setIsConfirmDialogOpen(false)
              }>Cancel</AlertDialogCancel>
              <AlertDialogAction
                  onClick={toggleReviewDisplay}
                  className={`px-4 py-2 text-white font-medium rounded-lg transition-all ${
                      confirmDialogAction === 'display'
                          ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300' // Blue for "Display"
                          : 'bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300' // Red for "Hide"
                  }`}
              >
                {confirmDialogAction === 'display' ? 'Display' : 'Hide'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog open={isConfirmDialogOpen1} onOpenChange={setIsConfirmDialogOpen1}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmDialogAction1
                    ? 'Display this review?'
                    : 'Hide this review?'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {confirmDialogAction1
                    ? 'This review will be visible in Homepage.'
                    : 'This review will be hidden in Homepage.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={
                () => setIsConfirmDialogOpen1(false)
              }>Cancel</AlertDialogCancel>
              <AlertDialogAction
                  onClick={toggleHomepageDisplay}
                  className={`px-4 py-2 text-white font-medium rounded-lg transition-all ${
                      confirmDialogAction1
                          ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300' // Blue for "Display"
                          : 'bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300' // Red for "Hide"
                  }`}
              >
                {confirmDialogAction1? 'Display' : 'Hide'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
  );
};

export default AdminReviewsPage;